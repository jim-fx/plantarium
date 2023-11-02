import { Entity, Property } from '@mikro-orm/core';
import { compare, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Role } from '../auth/enums/role.enum';
import { BaseEntity } from '../entities/BaseEntity';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  public email: string;

  @Property()
  public username: string;

  @Property()
  public role: Role = Role.USER;

  @Property({ nullable: true })
  public provider?: "github";

  @Property({ nullable: true })
  public providerId?: string;

  @Property({ nullable: true })
  public profilePic?: string;

  @Property({ nullable: true })
  @Exclude()
  private hash?: string;

  public async setPassword(pass: string) {
    this.hash = await hash(pass, 12);
  }

  public async comparePassword(password: string) {
    return compare(password, this.hash);
  }

}
