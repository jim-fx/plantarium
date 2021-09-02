import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { svelteTemplateEngine } from './template/engine';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.engine('svelte', svelteTemplateEngine);
  app.setViewEngine('svelte');

  app.useGlobalPipes(new ValidationPipe());

  return app.listen(3000);
}

export const viteNodeApp = bootstrap();
