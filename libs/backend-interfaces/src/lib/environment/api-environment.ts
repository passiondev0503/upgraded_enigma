import { Provider } from '@nestjs/common';

import { initializeClassProperties } from '../utils/class.util';

export interface IApiEnvironment {
  production: boolean;
  firebase: boolean;
  appName: string;
  wsPort: number;
  jwtSecret: string;
}

/**
 * Application name type.
 */
export type TApiAppName = 'Upgraded Enigma API' | string;

export const defaultWsPort = 8081;

/**
 * API application environment.
 */
export class AppApiEnvironment implements IApiEnvironment {
  public production = false;

  public firebase = false;

  public appName: TApiAppName = 'Upgraded Enigma API';

  public wsPort = defaultWsPort;

  public jwtSecret = '';

  constructor(input?: AppApiEnvironment) {
    initializeClassProperties<AppApiEnvironment>(this, input);
  }
}

/**
 * Api environment injection token.
 */
export const API_ENV = 'API_ENV';

export const apiAppEnvProvider: Provider = {
  provide: API_ENV,
  useFactory: () => new AppApiEnvironment(),
};
