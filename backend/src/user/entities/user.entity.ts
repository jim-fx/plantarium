import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/BaseEntity';

@Entity()
export class User extends BaseEntity {
  @Property({ unique: true })
  public email: string;

  @Property()
  public name: string;

  @Property()
  public password: string;
}
