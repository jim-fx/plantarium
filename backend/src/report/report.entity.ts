import {
  ArrayType,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/core';

@Entity()
export class Report {
  @PrimaryKey()
  id: number;

  @Property()
  email?: string;
}
