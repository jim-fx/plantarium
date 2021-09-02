import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
  constructor(private readonly em: EntityManager) {}

  create(dto: CreateReportDto): Report {
    const report = new Report();

    report.browser = dto.browser;
    report.type = dto.type;
    report.description = dto.description;
    report.stacktrace = dto.stacktrace;

    this.em.persistAndFlush(report);

    return report;
  }

  async getAll(): Promise<Report[]> {
    return this.em.find(Report, {});
  }
}
