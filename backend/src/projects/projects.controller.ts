import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { PlantProject } from "@plantarium/types";
import { Permissions } from 'auth/decorators/permissions.decorator';
import { Permission } from 'auth/enums/permission.enum';
import { Request } from 'express';
import { GetUser, UserRaw } from 'user/user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
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
  create(@Body() createProjectDto: PlantProject, @Req() req: _Request) {
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  private gbifMediaCache: Record<string, any> = {};
  @Get("/gbif/media/:gbifId")
  async getGbifImages(@Param("gbifId") id: string) {
    if (id in this.gbifMediaCache) return this.gbifMediaCache[id];
    const res = await fetch(`https://api.gbif.org/v1/species/${id}/media`)
    if (res.ok) {
      const json = await res.json();
      return json
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
