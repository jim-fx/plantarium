import { Module } from '@nestjs/common';
import { ReportController, ReportViewController } from './report.controller';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Module({
  imports: [Report],
  controllers: [ReportController, ReportViewController],
  providers: [ReportService],
})
export class ReportModule {}
