import { TSentryEnvironment } from './sentry.interface';
/**
 * Application name type.
 */
export type TAppName = 'Upgraded Enigma' | string;

/**
 * Web Client Application environment.
 */
export interface IWebClientAppEnvironment {
  production: boolean;
  platform: string;
  appName: TAppName;
  description: string;
  api: string;
  envoyUrl: string;
  sentryEnv: TSentryEnvironment;
  firebase?: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    defaultRtcRoomId: string;
  };
}
