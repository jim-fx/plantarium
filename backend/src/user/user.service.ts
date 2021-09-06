import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
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

	update(id: string, updateUserDto: UpdateUserDto) {
		return this.repository.nativeUpdate({ id }, updateUserDto);
	}

	remove(id: string) {
		return this.repository.remove({ id });
	}
}
