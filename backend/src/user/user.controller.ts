import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { getPermissionsForRole } from 'auth/enums/permission.enum';
import { Role } from 'auth/enums/role.enum';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('api/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    const users = await this.userService.findAll();
    if (req.user.role === Role.ADMIN) return users;
    return users.filter(u => u.role !== Role.ADMIN).map(u => {
      return { id: u._id, username: u.username, createdAt: u.createdAt, updatedAt: u.updatedAt, role: u.role }
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: { sub: any; id: any; }; }) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return this.userService.findById(req.user.sub || req.user.id);
  }

  @Get("exists/:name")
  async getNameExists(@Param("name") name: string) {
    const user = await this.userService.findOne(name)
    return !!user;
  }

  @Get("existsEmail/:email")
  async getEmailExists(@Param("email") email: string) {
    const user = await this.userService.find({ email });
    return !!user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get("role")
  getRole(@Request() req) {
    const { user: { role = Role.ANON } = {} } = req;
    console.log("ROLE", role);
    return role;
  }

  @Get("permission")
  getPermissions(@Request() req) {
    console.log("Eyy")
    const role = this.getRole(req);
    console.log({ role })
    const permissions = [...getPermissionsForRole(role)];
    console.log({ permissions })
    return { permissions };
  }
}
