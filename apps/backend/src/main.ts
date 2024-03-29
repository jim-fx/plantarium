import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PORT } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      logger: ['log', 'debug', 'error', 'verbose', 'warn'],
    },
  );

  app.useGlobalGuards(new JwtAuthGuard());

  app.use(cookieParser());

  app.use(helmet())

  app.enableCors();

  app.use(morgan('tiny'));

  app.useGlobalPipes(new ValidationPipe());

  return app.listen(PORT, '0.0.0.0');
}

export const viteNodeApp = bootstrap();
