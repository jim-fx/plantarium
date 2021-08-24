import { Controller, Get } from '@nestjs/common';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  public getReports(): Report[] {
    return [];
  }
}
