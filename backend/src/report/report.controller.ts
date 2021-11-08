import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Controller('api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }

  @Get('/:id')
  public getReportById(@Param('id') id: string) {
    return this.reportService.getById(id);
  }

  @Get()
  public getReports(): Promise<Report[]> {
    return this.reportService.getAll();
  }

  @Post()
  public create(@Body() createReportDto: CreateReportDto): Report {
    return this.reportService.create(createReportDto);
  }

  @Put("/:id")
  public updateReport(@Param("id") id: string, @Body() updateReportDto: UpdateReportDto) {
    console.log("Update", id);
    return this.reportService.updateReport(id, updateReportDto);
  }

  @Put('/:id/publish')
  public publish(@Param('id') id: string) {
    return this.reportService.publishToGithub(id);
  }

  @Put('/:id/unpublish')
  public unpublish(@Param('id') id: string) {
    return this.reportService.unpublishFromGithub(id);
  }

  @Get("/labels")
  public listLabels() {
    return this.reportService.getIssueLabels();
  }
}
