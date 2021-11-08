import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../entities/BaseEntity';
import { PLabel } from './dto/shared-types';

@Entity()
export class Report extends BaseEntity {
	@Property()
	type: 'bug' | 'feat';

  @Property()
  labels: PLabel[];

	@Property()
	title: string;

	@Property()
	gh_issue?: number;

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
