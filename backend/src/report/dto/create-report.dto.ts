import { IsIn, IsOptional, IsString, Length } from 'class-validator';

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
  readonly browser?: any;

  @IsOptional()
  @IsString()
  readonly userId?: string;
}
