import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, UnauthorizedException,
  UseGuards, UseInterceptors
} from '@nestjs/common';
import { getPermissionsForRole } from '../auth/enums/permission.enum';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser, UserRaw } from './user.decorator';
import { UserService } from './user.service';

function stripUser(u:UserRaw){
      return { id: u._id, username: u.username, createdAt: u.createdAt, updatedAt: u.updatedAt, role: u.role }
}

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
  async findAll(@GetUser() user: UserRaw) {
    const users = await this.userService.findAll();
    if (user.role === Role.ADMIN) return users;
    return users.filter(u => u.role !== Role.ADMIN).map(u => {
      return stipUser(u)
    })
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser() user: UserRaw) {
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.userService.findById(user.sub);
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


  @Get("role")
  getRole(@GetUser() user: UserRaw) {
    return user?.role ?? Role.ANON;
  }


  @Get('profile')
  async profile(@GetUser() user: UserRaw) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get("permission")
  getPermissions(@GetUser() user: UserRaw) {
    const role = this.getRole(user);
    const permissions = [...getPermissionsForRole(role)];
    return permissions;
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @GetUser() user:UserRaw) {
    if(user.role === Role.ADMIN) return this.userService.findById(id);
    const u = await this.userService.findById(id);
    return stripUser(u);
  }

  @Patch(':id')
  update(@Param('id') id: string, @GetUser() user: UserRaw, @Body() updateUserDto: UpdateUserDto) {
    if (user.role !== Role.ADMIN && user.sub !== id) {
      return new UnauthorizedException()
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: UserRaw) {
    if (user.role !== Role.ADMIN && user.sub !== id) {
      return new UnauthorizedException()
    }

    return this.userService.remove(id);
  }
}
