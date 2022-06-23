import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { PlantProject } from "@plantarium/types";
import { Permissions } from 'auth/decorators/permissions.decorator';
import { Permission } from 'auth/enums/permission.enum';
import { Request } from 'express';
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
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Permissions(Permission["project.delete"])
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
