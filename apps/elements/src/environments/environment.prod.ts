import { IWebClientAppEnvironment } from '@app/client-util';

import { metaEnvFactory } from './environment.config';
import { sentryEnvFactory } from './sentry.config';

/**
 * Production environment variables.
 */
export const environment: IWebClientAppEnvironment = {
  production: true,
  platform: 'web',
  appName: 'Upgraded Enigma Elements',
  description: 'Upgraded Enigma Elements: wigdets based on Angular Elements',
  api: window.location.origin.includes('localhost') ? 'http://localhost:8080/api' : `${window.location.origin}/api`,
  envoyUrl: 'http://localhost:8082', // TODO
  sentry: sentryEnvFactory({ production: true }),
  meta: metaEnvFactory(),
};
