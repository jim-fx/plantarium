import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import c from './mikro-orm.config';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

@Module({
  imports: [
    MikroOrmModule.forRoot(c),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '../../../admin/', 'build'),
    }),
    ReportModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
