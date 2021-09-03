import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import c from './mikro-orm.config';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MikroOrmModule.forRoot(c), ReportModule, UserModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
