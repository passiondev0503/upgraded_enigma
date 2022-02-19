import { IWebClientAppEnvironment } from '@app/client-util';

/**
 * Sentry environment configuration factory.
 */
export const sentryEnvFactory = (config: { production: boolean }): IWebClientAppEnvironment['sentry'] => ({
  env: config.production ? 'production' : 'development',
  dsn: 'https://a076fb94912040d1952c9d76dba44f85@o551250.ingest.sentry.io/5679603',
  tracingOrigins: ['localhost:4200', 'https://organizer-833bc.web.app', 'https://organizer-833bc.firebaseapp.com'],
  tracesSampleRate: 1.0,
});
