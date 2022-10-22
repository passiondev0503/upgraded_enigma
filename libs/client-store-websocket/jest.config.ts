import { Config } from '@jest/types';

const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config: Config.InitialOptions = {
  coverageDirectory: '../../coverage/libs/client-store-websocket',
  coverageThreshold: {
    // TODO: increate unit test coverage
    global: {
      branches: 88,
      functions: 90,
      lines: 92,
      statements: 93,
    },
  },
  displayName: 'client-store-websocket',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
