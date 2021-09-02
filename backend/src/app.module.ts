import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import c from './mikro-orm.config';
import { ReportModule } from './report/report.module';

@Module({
  imports: [MikroOrmModule.forRoot(c), ReportModule],
  controllers: [AppController],
})
export class AppModule {}
