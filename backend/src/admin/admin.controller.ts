import { Controller, UseGuards } from '@nestjs/common';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/enums/role.enum';
import { RolesGuard } from 'auth/guards/role.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {

  constructor(private readonly service: AdminService) { }

  @Roles(Role.ADMIN)
  public async cleanLogs() {


  }

}
