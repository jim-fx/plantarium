import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { PlantProject } from '@plantarium/types';
import { UserService } from 'user/user.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectType } from './entities/project.entity';
import * as examples from "./examples";

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project) private readonly repository: EntityRepository<Project>,
    private readonly userService: UserService
  ) { }

  async create(createProjectDto: PlantProject, userId: string) {

    const p = new Project();

    let user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException()
    }

    p.type = ProjectType.USER;

    p.author = user;

    p.plantId = createProjectDto.meta.id;

    p.data = createProjectDto;

    await this.repository.persistAndFlush(p)

    return p;
  }

  findAll({ type, offset = 0 }: { offset?: number, type?: ProjectType[] } = {}) {

    const query: FilterQuery<Project> = {};

    if (type?.length) {
      query["type"] = { $in: type }
    }

    return this.repository.find(query, { limit: 20, offset });
  }

  findOne(id: string) {
    return this.repository.findOne({ _id: id });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {

    const p = await this.findOne(id)

    if (!p) {
      throw new NotFoundException()
    }

    if (updateProjectDto.data) {
      p.data = updateProjectDto.data;
    }

    await this.repository.persistAndFlush(p);

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

    let ladyFern = await this.repository.findOne({ plantId: examples.fern.meta.id });
    if (!ladyFern) {
      ladyFern = new Project();
      ladyFern.plantId = examples.fern.meta.id;
      ladyFern.data = examples.fern
      ladyFern.author = admin;
      ladyFern.type = ProjectType.OFFICIAL;
      await this.repository.persistAndFlush(ladyFern);
    }

    let daisy = await this.repository.findOne({ plantId: examples.daisy.meta.id });
    if (!daisy) {
      daisy = new Project();
      daisy.plantId = examples.daisy.meta.id;
      daisy.data = examples.daisy
      daisy.author = admin;
      daisy.type = ProjectType.OFFICIAL;
      await this.repository.persistAndFlush(daisy);
    }


    let ladyHairFern = await this.repository.findOne({ plantId: examples.fernLadyHair.meta.id });
    if (!ladyHairFern) {
      ladyHairFern = new Project();
      ladyHairFern.plantId = examples.fernLadyHair.meta.id;
      ladyHairFern.data = examples.fernLadyHair
      ladyHairFern.author = admin;
      ladyHairFern.type = ProjectType.OFFICIAL;
      await this.repository.persistAndFlush(ladyHairFern);
    }


  }
}
