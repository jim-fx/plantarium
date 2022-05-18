import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from 'auth/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly repository: EntityRepository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    await user.setPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.username = createUserDto.name;
    return this.repository.persistAndFlush(user);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(username: string) {
    return this.repository.findOne({ username });
  }

  findById(id: string) {
    return this.repository.findOne({ _id: id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.repository.nativeUpdate({ _id: id }, updateUserDto);
  }

  remove(id: string) {
    return this.repository.remove({ _id: id });
  }

  async onModuleInit() {
    const { ADMIN_PASS } = process.env;
    if (ADMIN_PASS) {
      // This is super hackky, but we need to make sure the migrations happened
      setTimeout(async () => {
        let admin = await this.repository.findOne({ username: 'admin' });
        if (!admin) {
          admin = new User();
          admin.username = 'admin';
          admin.role = Role.ADMIN;
          admin.email = 'test@example.com';
          await admin.setPassword(ADMIN_PASS);

          this.repository.persistAndFlush(admin);
        }
      }, 1000)
    }
  }
}
