import dotenv from 'dotenv';
import { writeFile } from 'fs';
import { stat } from 'fs/promises';
import { argv } from 'yargs';

/**
 * Usage:
 * - ts-node ./tools/ts/set-portfolio-env.ts
 * - ts-node ./tools/ts/set-portfolio-env.ts --reset=true
 */

/**
 * Load environment variables.
 */
dotenv.config();

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
}

class AppEnvConfig {
  /**
   * Environment file path.
   */
  private readonly environmentFilePath = `${__dirname}/../../apps/client/src/environments/firebase.ts`;

  /**
   * Client app environment secrets.
   */
  private readonly defaultEnv: IEnvConfig = {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIREBASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
    projectId: 'FIREBASE_PROJECT_ID',
    storageBucket: 'FIREBASE_STORAGE_BUCKET',
    messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
    appId: 'FIREBASE_APP_ID',
    measurementId: 'FIREBASE_MEASUREMENT_ID',
    defaultRtcRoomId: 'DEFAULT_RTC_ROOM_ID',
  };

  constructor() {
    /**
     * If reset argument is passed (retrieved via yargs argv object) environment
     * variables in client app are set to default values.
     */
    const reset = (<{ [k: string]: boolean | undefined }>argv).reset;

    const env = typeof reset !== 'undefined' ? { ...this.defaultEnv } : this.getEnvValues();

    this.writeEnvironmentFile(env);
  }

  /**
   * Returns environment configuration file contents.
   */
  private envConfigFileContents(env: IEnvConfig) {
    return `export const firebase = {
  apiKey: '${env.apiKey}',
  authDomain: '${env.authDomain}',
  databaseURL: '${env.databaseURL}',
  projectId: '${env.projectId}',
  storageBucket: '${env.storageBucket}',
  messagingSenderId: '${env.messagingSenderId}',
  appId: '${env.appId}',
  measurementId: '${env.measurementId}',
  defaultRtcRoomId: '${env.defaultRtcRoomId}',
};
`;
  }

  /**
   * Writes environment file.
   */
  private writeEnvironmentFile(env: IEnvConfig) {
    stat(this.environmentFilePath)
      .then(data => {
        const envFileContents = this.envConfigFileContents(env);
        writeFile(this.environmentFilePath, envFileContents, err => {
          if (err !== null) {
            // eslint-disable-next-line no-console -- log error
            console.log(err);
            process.exit(1);
          }

          // eslint-disable-next-line no-console -- log success
          console.log(`Output generated at ${this.environmentFilePath}`);
        });
      })
      .catch(error => {
        // eslint-disable-next-line no-console -- log error
        console.error(error);
        process.exit(1);
      });
  }

  /**
   * Gets environment variable value.
   * @param key environment variable key
   * @returns environment variable value or key if value is null or undefined
   */
  private getEnvValue(key: TEnvironmentKey) {
    return process.env[key] ?? key;
  }

  /**
   * Sets environment variable values from process.env.
   */
  private getEnvValues(): IEnvConfig {
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
    };
    return env;
  }
}

new AppEnvConfig();
