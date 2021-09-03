import { BeforeCreate, Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/BaseEntity';
import { hash, compare } from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  public email: string;

  @Property()
  public name: string;

  @Property()
  private hash: string;

  get password() {
    return this.hash;
  }

  public async setPassword(pass: string) {
    this.hash = await hash(pass, 12);
  }

  public async comparePassword(password: string) {
    return compare(password, this.password);
  }
}
