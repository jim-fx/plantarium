import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Patch, Post, Put, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { Role } from '../auth/enums/role.enum';
import { GetUser, UserRaw } from '../user/user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

interface _Request extends Request {
  user: {
    sub: string;
  }
}

@Controller('api/project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Roles(Role.USER, Role.ADMIN)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: _Request) {
    return this.projectsService.create(createProjectDto, req?.user?.sub);
  }

  @Get()
  findAll(@Req() req: Request) {

    let type: number[] = []

    if (req.query) {
      if (Array.isArray(req.query.type)) {
        type = (req.query.type as string[]).map(s => parseInt(s))
      } else if (typeof req.query.type === "string") {
        type = [parseInt(req.query.type)]
      }
    }

    return this.projectsService.findAll({ type });
  }

  @Put(':id/like')
  likeProject(@Param('id') id: string, @GetUser() user: UserRaw) {
    return this.projectsService.setLike(id, user.sub, true);
  }

  @Delete(':id/like')
  removeLike(@Param('id') id: string, @GetUser() user: UserRaw) {
    return this.projectsService.setLike(id, user.sub, false);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get("debug")
  test() {
    return {
      "blue": "cheese"
    }
  }

  private gbifMediaCache: Record<string, any> = {};
  @Get("/gbif/media/:gbifId")
  async getGbifImages(@Param("gbifId") id: number) {
    if (id in this.gbifMediaCache) return this.gbifMediaCache[id];
    try {
      const res = await fetch(`https://api.gbif.org/v1/species/${id}/media`)
      if (res.ok) {
        const json = await res.json();
        return json
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException()
    }
    return {}
  }

  @Patch(':id')
  async update(@Param('id') id: string, @GetUser() user: UserRaw, @Body() updateProjectDto: UpdateProjectDto) {

    const project = await this.projectsService.findOne(id);

    if (!project) {
      throw new NotFoundException()
    }

    if (user.role !== Role.ADMIN && user.sub !== project.author?._id) {
      throw new UnauthorizedException()
    }

    if (user.role !== Role.ADMIN && "type" in updateProjectDto) {
      throw new UnauthorizedException()
    }

    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Permissions(Permission["project.delete"])
  async remove(@Param('id') id: string, @GetUser() user: UserRaw) {

    const project = await this.projectsService.findOne(id);

    if (!project) {
      throw new NotFoundException()
    }

    if (user.role !== Role.ADMIN && project.author?._id !== user.sub) {
      throw new UnauthorizedException()
    }

    return this.projectsService.remove(id);
  }
}
