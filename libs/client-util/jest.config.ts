import { Config } from '@jest/types';

const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config: Config.InitialOptions = {
  coverageDirectory: '../../coverage/libs/client-util',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 56,
      functions: 57,
      lines: 53,
      statements: 55,
    },
  },
  displayName: 'client-util',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
