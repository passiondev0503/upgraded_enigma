import * as dotenv from 'dotenv';
import { writeFile } from 'fs';
import { argv } from 'yargs';

/**
 * Usage:
 * - ts-node src/set-env.ts
 * - ts-node src/set-env.ts --reset=true
 */

/**
 * Environment file path.
 */
const targetPath = './apps/client/src/environments/firebase.ts';

/**
 * Environment file config.
 */
let envConfigFile = `export const firebase = {
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
`;

/**
 * If reset argument is passed (retrieved via yargs argv object) environment
 * variables in client app are set to default values.
 */
const reset = argv.reset;

if (typeof reset === 'undefined' || reset === false) {
  /**
   * Load environment variables.
   */
  dotenv.config();

  /**
   * Environment file config.
   */
  envConfigFile = `
export const firebase = {
  apiKey: '${process.env.FIREBASE_API_KEY}',
  authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
  databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
  projectId: '${process.env.FIREBASE_PROJECT_ID}',
  storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
  messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
  appId: '${process.env.FIREBASE_APP_ID}',
  measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}',
  defaultRtcRoomId: '${process.env.DEFAULT_RTC_ROOM_ID}',
};
`;
}

/**
 * Writes environment file.
 */
writeFile(targetPath, envConfigFile, err => {
  if (err !== null) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
