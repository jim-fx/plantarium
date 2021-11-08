import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { AppModule } from './app.module';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{
			logger: ['log', 'debug', 'error', 'verbose', 'warn'],
		},
	);

  console.log(process.env);

	app.use(cookieParser());

	app.enableCors();

	app.use(morgan('tiny'));

	app.useGlobalPipes(new ValidationPipe());

	return app.listen(3000);
}

export const viteNodeApp = bootstrap();
