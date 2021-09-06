import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { svelteTemplateEngine } from './template/engine';
import * as morgan from 'morgan';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ['log', 'debug', 'error', 'verbose', 'warn'],
	});

	app.use(cookieParser());

	app.engine('svelte', svelteTemplateEngine);
	app.set('views', path.join(__dirname, '../../src/views'));
	app.setViewEngine('svelte');

	app.use(morgan('tiny'));

	app.useGlobalPipes(new ValidationPipe());

	return app.listen(3000);
}

export const viteNodeApp = bootstrap();
