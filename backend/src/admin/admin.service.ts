import { Injectable } from '@nestjs/common';
import { ReportService } from '../report/report.service';

@Injectable()
export class AdminService {
  constructor(private readonly reportService: ReportService) { }
  async compressReports() {
    return this.reportService.compressReports();
  }
}
