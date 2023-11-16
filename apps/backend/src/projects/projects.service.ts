import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectType } from './entities/project.entity';
import * as examples from "./examples";

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project) private readonly repository: EntityRepository<Project>,
    private readonly userService: UserService
  ) { }

  async create(createProjectDto: CreateProjectDto, userId: string) {

    const p = new Project();

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException()
    }

    p.type = ProjectType.USER;

    p.author = user;

    p.nodes = createProjectDto.nodes;

    p.meta = createProjectDto.meta;

    await this.repository.persistAndFlush(p)

    return p;
  }

  findAll({ type, offset = 0 }: { offset?: number, type?: ProjectType[] } = {}) {

    const query: FilterQuery<Project> = {};

    if (type?.length) {
      query["type"] = { $in: type }
    }

    return this.repository.find(query, { limit: 20, offset, populate: ["likes"] });
  }

  async findOne(id: string) {
    const project = await this.repository.findOne({ _id: id }, { populate: ["likes"] });
    return project;
  }

  async setLike(id: string, userId: string, like: boolean) {

    const project = await this.repository.findOne({ _id: id });

    if (!project) {
      throw new NotFoundException("Proejct not found")
    }

    await project.likes.init()

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found")
    }

    if (like) {

      project.addLike(user);
    } else {
      project.removeLike(user);
    }

    await this.repository.persistAndFlush(project);

    return project;
  }


  async update(id: string, updateProjectDto: UpdateProjectDto) {

    const p = await this.findOne(id)

    console.log({ p, updateProjectDto });

    if (!p) {
      throw new NotFoundException()
    }

    if (updateProjectDto.nodes) {
      p.nodes = updateProjectDto.nodes;
    }

    if ("type" in updateProjectDto) {
      p.type = updateProjectDto.type
    }

    if (updateProjectDto.meta) {
      p.meta = updateProjectDto.meta;
    }

    this.repository.getEntityManager().flush()

    return p;
  }

  async remove(id: string) {

    const project = await this.repository.findOne({ _id: id })
    if (!project) {
      throw new NotFoundException()
    }

    await this.repository.removeAndFlush(project);

    return id;
  }

  async init() {


    const admin = await this.userService.findOne("admin");

    const existingExamples = await this.repository.find({ type: ProjectType.OFFICIAL });

    for (const key of Object.keys(examples)) {
      const example = examples[key];

      if (!example.meta.scientificName) continue;

      const existing = existingExamples.find(v => {
        return v.meta.name === example.meta.name
      });

      if (!existing) {
        const newExample = new Project();
        newExample.meta = example.meta;
        newExample.nodes = example.nodes;
        newExample.author = admin;
        newExample.type = ProjectType.OFFICIAL;
        await this.repository.persistAndFlush(newExample);
      }
    }
  }
}
