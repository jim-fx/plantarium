import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Controller('api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  public getReports(): Promise<Report[]> {
    return this.reportService.getAll();
  }

  @Post()
  public create(@Body() createReportDto: CreateReportDto): Report {
    return this.reportService.create(createReportDto);
  }
}
