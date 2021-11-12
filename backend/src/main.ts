import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';
import { PORT } from "./config";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: ['log', 'debug', 'error', 'verbose', 'warn'],
    },
  );

  app.useGlobalGuards(new JwtAuthGuard());

  app.use(cookieParser());

  app.enableCors();

  app.use(morgan('tiny'));

  app.useGlobalPipes(new ValidationPipe());

  return app.listen(PORT, '0.0.0.0');
}

export const viteNodeApp = bootstrap();
