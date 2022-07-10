import { TSentryEnvironment } from './sentry.interface';
/**
 * Application name type.
 */
export type TAppName = 'Upgraded Enigma' | string;

/**
 * Capacitor platform.
 */
export type TCapacitorPlatform = 'android' | 'ios' | 'web' | string;

export interface ISentryEnvironmentConfig {
  env: TSentryEnvironment;
  dsn: string;
  tracingOrigins: string[];
  tracesSampleRate: number;
}

export interface IFirebaseEnvironmentConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  defaultRtcRoomId: string;
}

export interface IMetadataEnvironmentConfig {
  version: string;
}

export interface IClientEnvironmentConfig {
  firebase: IFirebaseEnvironmentConfig;
  meta: IMetadataEnvironmentConfig;
}

/**
 * Web Client Application environment.
 */
export interface IWebClientAppEnvironment {
  production: boolean;
  platform: TCapacitorPlatform;
  appName: TAppName;
  description: string;
  api: string;
  sentry: ISentryEnvironmentConfig;
  firebase?: IFirebaseEnvironmentConfig;
  meta: IMetadataEnvironmentConfig;
}
