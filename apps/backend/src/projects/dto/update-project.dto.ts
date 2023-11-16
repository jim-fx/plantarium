import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { ProjectType } from '../entities/project.entity';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  type: ProjectType;
}
