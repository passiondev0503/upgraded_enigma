const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-util',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 56,
      functions: 66,
      lines: 58,
      statements: 60,
    },
  },
  displayName: 'client-util',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
