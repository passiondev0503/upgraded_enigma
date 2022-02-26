import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

/**
 * Utility dev server.
 * Resets client app environment variables.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = '';
  app.setGlobalPrefix(globalPrefix);
  app.enableShutdownHooks();
  const defaultPort = 4201;
  const port = process.env.PORT ?? defaultPort;
  await app.listen(port);
  Logger.log(`🚀 Dev server is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.verbose(`Dev server > The dev server resets client app environment variables after the application stops.`);
}

void bootstrap();
