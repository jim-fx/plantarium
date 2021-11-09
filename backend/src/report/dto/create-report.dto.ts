import { IsEnum, IsIn, IsOptional, IsString, Length } from 'class-validator';
import Areas from '../../enums/areas.enum';

export class CreateReportDto {
	@IsIn(['bug', 'feat'])
	@IsString()
	readonly type: 'bug' | 'feat';

	@IsString()
	@Length(2, 400)
	readonly description: string;

	@IsOptional()
	readonly stacktrace?: any;

	@IsOptional()
	@IsIn(['UI', 'Nodes', 'NodeSystem', 'Geometry', 'ProjectManager', 'Scene'], {
		each: true,
	})
	readonly labels?: string[];

	@IsOptional()
	readonly browser?: any;

	@IsOptional()
	@IsString()
	readonly userId?: string;
}
