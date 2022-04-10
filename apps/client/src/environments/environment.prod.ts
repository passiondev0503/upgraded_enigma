import { IWebClientAppEnvironment, TCapacitorPlatform } from '@app/client-util';
import { Capacitor } from '@capacitor/core';

import { firebaseEnvFactory, metaEnvFactory } from './environment.config';
import { sentryEnvFactory } from './sentry.config';

const platform: TCapacitorPlatform = Capacitor.getPlatform();

/**
 * Production environment variables.
 */
export const environment: IWebClientAppEnvironment = {
  production: true,
  platform,
  appName: 'Upgraded Enigma Client',
  description: 'Upgraded Enigma client application.',
  api:
    platform !== 'web'
      ? 'https://upgraded-enigma.web.app/api'
      : window.location.origin.includes('localhost')
      ? 'http://localhost:8080/api'
      : `${window.location.origin}/api`,
  envoyUrl: 'http://localhost:8082', // TODO
  firebase: firebaseEnvFactory(),
  sentry: sentryEnvFactory({ production: true }),
  meta: metaEnvFactory(),
};
