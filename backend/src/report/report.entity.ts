import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../entities/BaseEntity';
import { PLabel } from './dto/shared-types';

@Entity()
export class Report extends BaseEntity {
	@Property()
	type: 'bug' | 'feat';

  @Property({type:"json"})
  labels: PLabel[];

	@Property()
	title: string;

	@Property()
	gh_issue?: number;

	@Property()
	open = true;

	@Property()
	description?: string;

	@Property({type:"json"})
	stacktrace?: any;

	@Property({type:"json"})
	browser?: any;

	@Property()
	userId?: string;
}
