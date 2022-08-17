import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from "@nestjs/throttler";
import { ProjectsService } from 'projects/projects.service';
import { UserService } from 'user/user.service';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ProjectsModule } from './projects/projects.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    ReportModule,
    UserModule,
    AuthModule,
    ProjectsModule,
    HealthModule,
    AdminModule,
  ],

  controllers: [AppController],
})
export class AppModule implements OnModuleInit {

  constructor(private readonly orm: MikroORM, private userService: UserService, private projectService: ProjectsService) { }

  async onModuleInit(): Promise<void> {

    if (!process.env.DB_MONGO_URL) {
      const migrator = this.orm.getMigrator();

      await migrator.up();
    };

    await this.userService.init()

    await this.projectService.init()

  }

}
