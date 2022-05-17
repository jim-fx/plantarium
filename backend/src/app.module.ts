import { MikroORM } from '@mikro-orm/core';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import config from "./config"

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    ReportModule,
    UserModule,
    AuthModule,
  ],

  controllers: [AppController],
})
export class AppModule implements OnModuleInit {

  constructor(private readonly orm: MikroORM) { }

  async onModuleInit(): Promise<void> {

    if (process.env.DB_MONGO_URL) return;

    const migrator = this.orm.getMigrator();

    await migrator.up();
  }

}
