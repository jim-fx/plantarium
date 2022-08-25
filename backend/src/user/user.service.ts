import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';
import { CreateProviderUserDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly repository: EntityRepository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    await user.setPassword(createUserDto.password);
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    await this.repository.persistAndFlush(user);
    return user;
  }

  async createProvider(createUserDto: CreateProviderUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.profilePic = createUserDto.profilePic;
    user.username = createUserDto.username;
    user.provider = createUserDto.provider;
    user.providerId = createUserDto.providerId;
    await this.repository.persistAndFlush(user);
    return user;
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(username: string) {
    return this.repository.findOne({ username });
  }

  find(search: Partial<User>) {
    return this.repository.findOne(search)
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

  async init() {
    const { ADMIN_PASS } = process.env;
    if (ADMIN_PASS) {
      try {

        let admin = await this.repository.findOne({ role: Role.ADMIN });
        if (!admin) {
          admin = new User();
          admin.username = 'admin';
          admin.role = Role.ADMIN;
          admin.email = 'test@example.com';
          await admin.setPassword(ADMIN_PASS);
          this.repository.persistAndFlush(admin);
        }
      } catch (error) {

      }
    }
  }
}
