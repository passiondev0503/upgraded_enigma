import { Config } from '@jest/types';

const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config: Config.InitialOptions = {
  coverageDirectory: '../../coverage/libs/client-store-user',
  coverageThreshold: {
    // TODO: complete the store logic and increase unit test coverage
    global: {
      branches: 35,
      functions: 47,
      lines: 66,
      statements: 64,
    },
  },
  displayName: 'client-store-user',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
