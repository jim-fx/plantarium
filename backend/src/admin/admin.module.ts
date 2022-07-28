import { Module } from '@nestjs/common';
import { ReportModule } from '../report/report.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [ReportModule]
})
export class AdminModule { }
