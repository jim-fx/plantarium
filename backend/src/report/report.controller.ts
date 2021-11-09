import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
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

	@Post('/:id/publish')
	public publish(@Param('id') id: string) {
		return { id };
	}

	@Post('/:id/unpublish')
	public unpublish(@Param('id') id: string) {
		return { id };
	}
}
