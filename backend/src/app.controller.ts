import { Controller } from '@nestjs/common';
import { Permissions } from 'auth/decorators/permissions.decorator';
import { Permission } from 'auth/enums/permission.enum';

@Controller()
@Permissions(Permission["user.delete"])
export class AppController { }
