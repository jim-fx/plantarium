import { Controller } from '@nestjs/common';
import { Roles } from 'auth/decorators/roles.decorator';
import { Role } from 'auth/enums/role.enum';

@Controller()
@Roles(Role.ANON)
export class AppController {}
