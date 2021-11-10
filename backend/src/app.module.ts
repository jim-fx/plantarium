import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import c from './mikro-orm.config';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';

const staticAdminPath = resolve('../admin/build');

@Module({
  imports: [
    MikroOrmModule.forRoot(c),
    ServeStaticModule.forRoot({
      rootPath: staticAdminPath,
    }),
    ReportModule,
    UserModule,
    AuthModule,
  ],

  controllers: [AppController],
})
export class AppModule {}
