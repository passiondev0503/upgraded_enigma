import { ApiEnvironment, defaultWsPort } from '@upgraded-enigma/backend-interfaces';

/**
 * Production environment variables.
 */
export const environment: ApiEnvironment = {
  production: true,
  appName: 'Upgraded Enigma Client API',
  wsPort: defaultWsPort,
  jwtSecret: 'jwtsecret', // TODO: should be set from .env
};
