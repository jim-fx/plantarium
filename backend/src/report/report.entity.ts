import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../entities/BaseEntity';

@Entity()
export class Report extends BaseEntity {
  @Property()
  type: 'bug' | 'feat';

  @Property()
  open = true;

  @Property()
  description?: string;

  @Property()
  stacktrace?: any;

  @Property()
  browser?: any;

  @Property()
  userId?: string;
}
