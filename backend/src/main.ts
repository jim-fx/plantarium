import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ['log', 'debug', 'error', 'verbose', 'warn'],
	});

	app.use(cookieParser());

	app.enableCors();

	app.use(morgan('tiny'));

	app.useGlobalPipes(new ValidationPipe());

	return app.listen(3000);
}

export const viteNodeApp = bootstrap();
