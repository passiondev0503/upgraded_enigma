import { defaultWsPort, IApiEnvironment } from '@app/backend-interfaces';

/**
 * Development environment variables.
 * This file can be replaced during build by using the `fileReplacements` array.
 * `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
 * The list of file replacements can be found in `angular.json`.
 */
export const environment: IApiEnvironment = {
  production: false,
  firebase: false,
  appName: 'Upgraded Enigma API',
  wsPort: defaultWsPort,
  jwtSecret: 'jwtsecret', // TODO: should be set from .env
};
