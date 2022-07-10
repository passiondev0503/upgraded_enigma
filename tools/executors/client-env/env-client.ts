import { ExecutorContext } from '@nrwl/devkit';

import { AppBaseEnvConfig } from './env-base';
import { IExecutorOptions, TSupportedApp } from './schema';

type TEnvironmentKey =
  | 'FIREBASE_API_KEY'
  | 'FIREBASE_AUTH_DOMAIN'
  | 'FIREBASE_DATABASE_URL'
  | 'FIREBASE_PROJECT_ID'
  | 'FIREBASE_STORAGE_BUCKET'
  | 'FIREBASE_MESSAGING_SENDER_ID'
  | 'FIREBASE_APP_ID'
  | 'FIREBASE_MEASUREMENT_ID'
  | 'DEFAULT_RTC_ROOM_ID';

interface IEnvConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  defaultRtcRoomId: string;
  version: string;
}

export class AppClientEnvConfig extends AppBaseEnvConfig<IEnvConfig> {
  protected supportedApps: TSupportedApp[] = ['client'];

  protected defaultEnv: IEnvConfig = {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    appId: 'FIREBASE_APP_ID',
    measurementId: 'FIREBASE_MEASUREMENT_ID',
    defaultRtcRoomId: 'DEFAULT_RTC_ROOM_ID',
    version: 'N/A',
  };

  constructor(options: IExecutorOptions, context: ExecutorContext) {
    super(options, context);
  }

  protected envConfigFileContents(env: IEnvConfig) {
    return `import { IClientEnvironmentConfig } from '@app/client-util';

/**
 * The application environment configuration factory.
 * @returns application environment configuration
 */
export const appEnvFactory = (): IClientEnvironmentConfig => ({
  firebase: {
    apiKey: '${env.apiKey}',
    authDomain: '${env.authDomain}',
    databaseURL: '${env.databaseURL}',
    projectId: '${env.projectId}',
    storageBucket: '${env.storageBucket}',
    messagingSenderId: '${env.messagingSenderId}',
    appId: '${env.appId}',
    measurementId: '${env.measurementId}',
    defaultRtcRoomId: '${env.defaultRtcRoomId}',
  },
  meta: {
    version: '${env.version}',
  },
});
`;
  }

  protected getEnvValue(key: TEnvironmentKey) {
    return process.env[key] ?? key;
  }

  protected async getEnvValues(): Promise<IEnvConfig> {
    const version = await this.getPackageVersion();

    const env: IEnvConfig = {
      apiKey: this.getEnvValue('FIREBASE_API_KEY'),
      authDomain: this.getEnvValue('FIREBASE_AUTH_DOMAIN'),
      databaseURL: this.getEnvValue('FIREBASE_DATABASE_URL'),
      projectId: this.getEnvValue('FIREBASE_PROJECT_ID'),
      storageBucket: this.getEnvValue('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.getEnvValue('FIREBASE_MESSAGING_SENDER_ID'),
      appId: this.getEnvValue('FIREBASE_APP_ID'),
      measurementId: this.getEnvValue('FIREBASE_MEASUREMENT_ID'),
      defaultRtcRoomId: this.getEnvValue('DEFAULT_RTC_ROOM_ID'),
      version,
    };
    return env;
  }
}
