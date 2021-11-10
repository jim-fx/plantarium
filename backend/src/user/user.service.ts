import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly repository: EntityRepository<User>,
  ) {}

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
    return this.repository.findOne({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.repository.nativeUpdate({ id }, updateUserDto);
  }

  remove(id: string) {
    return this.repository.remove({ id });
  }

  async onModuleInit() {
    const { ADMIN_PASS } = process.env;
    if (ADMIN_PASS) {
      let admin = await this.repository.findOne({ username: 'admin' });
      if (!admin) {
        admin = new User();
        admin.username = 'admin';
        admin.email = 'test@example.com';
        await admin.setPassword(ADMIN_PASS);
        this.repository.persistAndFlush(admin);
      }
    }
  }
}
