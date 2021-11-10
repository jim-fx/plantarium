import { IsEnum, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { labels, PLabel } from './shared-types';

export class UpdateReportDto {
  @IsIn(['bug', 'feat'])
  @IsString()
  @IsOptional()
  readonly type: 'bug' | 'feat';

  @IsString()
  @Length(2, 400)
  @IsOptional()
  readonly description: string;

  @IsOptional()
  @IsIn(labels, {
    each: true,
  })
  readonly labels?: PLabel[];

  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly userId?: string;
}
