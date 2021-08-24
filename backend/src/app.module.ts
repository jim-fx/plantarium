import { Module } from '@nestjs/common';
import { ReportModule } from './report/report.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import c from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(c), ReportModule],
})
export class AppModule {}
