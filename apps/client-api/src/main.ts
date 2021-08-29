import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import e from 'express';

import { ClientApiAppModule } from './app/app.module';
import { environment } from './environments/environment';

/**
 * Express server.
 */
const server: e.Express = e();
/**
 * Defult port value.
 */
const defaultPort = 8080;

/**
 * Bootstraps server.
 */
async function bootstrap(expressInstance: e.Express): Promise<unknown> {
  const app = await NestFactory.create(ClientApiAppModule, new ExpressAdapter(expressInstance));
  app.useWebSocketAdapter(new WsAdapter(app));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const corsOptions: CorsOptions = {
    origin: [/localhost/],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  const port = typeof process.env.port !== 'undefined' ? process.env.port : defaultPort;
  await app.listen(port, () => {
    console.warn(`Listening at:
    - http://localhost:${port}/${globalPrefix}/diagnostics
    - http://localhost:${port}/${globalPrefix}/auth
    - http://localhost:${port}/${globalPrefix}/user
    - ws://localhost:${environment.wsPort}/api/events`);
  });

  return app.init();
}

void bootstrap(server);

/**
 * Terminator function.
 * Runs when application is terminated.
 */
function terminator(sig?: string) {
  if (typeof sig === 'string') {
    console.log(`\n${new Date(Date.now())}: Received signal ${sig} - terminating app...\n`);
    process.exit(0);
  }
}

/**
 * Termination handlers.
 */
(() => {
  process.on('exit', () => {
    terminator('exit');
  });
  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(
    element => {
      process.on(element, () => {
        terminator(element);
      });
    },
  );
})();
