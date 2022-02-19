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
  sentry: {
    env: TSentryEnvironment;
    dsn: string;
    tracingOrigins: string[];
    tracesSampleRate: number;
  };
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
