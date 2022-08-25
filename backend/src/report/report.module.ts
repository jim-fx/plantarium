import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ReportController } from './report.controller';
import { Report } from './report.entity';
import { ReportService } from './report.service';

@Module({
  imports: [MikroOrmModule.forFeature([Report]), UserModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule { }
