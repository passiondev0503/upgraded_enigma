import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ExpressAdapter } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { backendGrpcClientOptions } from '@upgraded-enigma/backend-grpc';
import { spawn } from 'child_process';
import e from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { ApiAppModule } from './app/app.module';
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
  const app = await NestFactory.create(ApiAppModule, new ExpressAdapter(expressInstance));
  app.useWebSocketAdapter(new WsAdapter(app));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const corsOptions: CorsOptions = {
    origin: [/localhost/, /firebase\.app/, /web\.app/],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  };
  app.enableCors(corsOptions);

  // TODO: debug grpc in firebase, currently it causes all functions deployment failure
  if (!Boolean(environment.firebase)) {
    const grpcClientOptions = backendGrpcClientOptions(environment);
    app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);
    await app.startAllMicroservicesAsync();
  }

  const port = typeof process.env.port !== 'undefined' ? process.env.port : defaultPort;
  await app.listen(port, () => {
    console.warn(`Listening at:
    - http://localhost:${port}/${globalPrefix}/diagnostics
    - http://localhost:${port}/${globalPrefix}/graphql
    - http://localhost:${port}/${globalPrefix}/grpc
    - http://localhost:${port}/${globalPrefix}/grpc/:id
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
    /**
     * Reset client env variables if dev argument is passed.
     */
    if (sig === 'exit' && !Boolean(process.env.FIREBASE_CONFIG)) {
      /**
       * Resets client environment variables configuration to default values.
       */
      const envResetter = spawn('ng', ['run', 'tools:reset-client-env'], {
        stdio: 'inherit',
        detached: true,
      });
      envResetter.on('close', code => {
        process.exit(code ?? 0);
      });
    } else {
      process.exit(0);
    }
  }
}

/**
 * Initialize admin and export firebase functions only in cloud environment.
 */
if (Boolean(process.env.FIREBASE_CONFIG)) {
  admin.initializeApp();
  (exports as Record<string, unknown>).diagnostics = functions.https.onRequest(server);
  (exports as Record<string, unknown>).graphql = functions.https.onRequest(server);
  // TODO: handle websocket events (exports as Record<string, unknown>).events = functions.https.onRequest(server);
  // TODO: (exports as Record<string, unknown>).grpc = functions.https.onRequest(server);
} else {
  /**
   * Termination handlers.
   */
  (() => {
    process.on('exit', () => {
      terminator('exit');
    });
    [
      'SIGHUP',
      'SIGINT',
      'SIGQUIT',
      'SIGILL',
      'SIGTRAP',
      'SIGABRT',
      'SIGBUS',
      'SIGFPE',
      'SIGUSR1',
      'SIGSEGV',
      'SIGUSR2',
      'SIGTERM',
    ].forEach(element => {
      process.on(element, () => {
        terminator(element);
      });
    });
  })();
}
