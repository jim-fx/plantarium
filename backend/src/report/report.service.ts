import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
	constructor(
		@InjectRepository(Report)
		private readonly repository: EntityRepository<Report>,
	) { }

	create(dto: CreateReportDto): Report {
		const report = new Report();

		report.browser = dto.browser;
		report.type = dto.type;
		report.description = dto.description;
		report.stacktrace = dto.stacktrace;

		this.repository.persistAndFlush(report);

		return report;
	}

	getById(id: string) {
		return this.repository.findOne({ id });
	}

	async getAll(): Promise<Report[]> {
		return this.repository.findAll();
	}
}
