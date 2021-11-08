import { Entity, Property } from '@mikro-orm/core';
import { compare, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../entities/BaseEntity';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  public email: string;

  @Property()
  public username: string;

  @Property()
  @Exclude()
  private hash: string;

  public async setPassword(pass: string) {
    this.hash = await hash(pass, 12);
  }

  public async comparePassword(password: string) {
    return compare(password, this.hash);
  }
}
