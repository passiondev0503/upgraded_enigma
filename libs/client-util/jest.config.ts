const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-util',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 48,
      functions: 36,
      lines: 33,
      statements: 36,
    },
  },
  displayName: 'client-util',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
