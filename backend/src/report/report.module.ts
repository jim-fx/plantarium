import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from './report.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
