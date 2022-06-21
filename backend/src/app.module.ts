import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProjectsModule } from './projects/projects.module';
import { UserService } from 'user/user.service';
import { User } from 'user/user.entity';
import { Role } from 'auth/enums/role.enum';

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
  ],

  controllers: [AppController],
})
export class AppModule implements OnModuleInit {

  constructor(private readonly orm: MikroORM, private userService: UserService) { }

  async onModuleInit(): Promise<void> {

    if (process.env.DB_MONGO_URL) return;

    const migrator = this.orm.getMigrator();

    await migrator.up();

    await this.userService.init()

  }

}
