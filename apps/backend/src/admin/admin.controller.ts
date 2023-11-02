import { Controller, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/role.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {

  constructor(private readonly service: AdminService) { }

}
