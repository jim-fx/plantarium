import {  IsIn, IsOptional, IsString, Length } from 'class-validator';
import { PLabel, labels } from './shared-types';

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
  @IsIn(labels, {
    each: true,
  })
  readonly labels?: PLabel[];

  @IsOptional()
  readonly title: string;

  @IsOptional()
  readonly browser?: any;

  @IsOptional()
  @IsString()
  readonly userId?: string;
}
