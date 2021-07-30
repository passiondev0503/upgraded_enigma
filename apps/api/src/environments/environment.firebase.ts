import { ApiEnvironment, defaultWsPort } from '@app/backend-interfaces';

/**
 * Production environment variables.
 */
export const environment: ApiEnvironment = {
  production: true,
  firebase: true,
  appName: 'Upgraded Enigma API',
  wsPort: defaultWsPort,
  jwtSecret: 'jwtsecret', // TODO: should be set from .env
};
