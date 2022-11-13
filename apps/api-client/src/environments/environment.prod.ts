import { defaultWsPort, IApiEnvironment } from '@app/backend-interfaces';

/**
 * Production environment variables.
 */
export const environment: IApiEnvironment = {
  production: true,
  firebase: false,
  appName: 'Upgraded Enigma Client API',
  wsPort: defaultWsPort,
  jwtSecret: 'jwtsecret', // TODO: should be set from .env
};
