import { ApiEnvironment } from '@upgraded-enigma/backend-interfaces';

/**
 * Production environment variables.
 */
export const environment: ApiEnvironment = {
  production: true,
  firebase: true,
  appName: 'Upgraded Enigma API',
  wsPort: 8081,
};
