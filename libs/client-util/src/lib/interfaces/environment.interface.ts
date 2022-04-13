import { TSentryEnvironment } from './sentry.interface';
/**
 * Application name type.
 */
export type TAppName = 'Upgraded Enigma' | string;

/**
 * Capacitor platform.
 */
export type TCapacitorPlatform = 'android' | 'ios' | 'web' | string;

/**
 * Web Client Application environment.
 */
export interface IWebClientAppEnvironment {
  production: boolean;
  platform: TCapacitorPlatform;
  appName: TAppName;
  description: string;
  api: string;
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
  meta: {
    version: string;
  };
}
