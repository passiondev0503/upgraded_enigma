const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-store-http-progress',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 80,
      functions: 93,
      lines: 98,
      statements: 97,
    },
  },
  displayName: 'client-store-http-progress',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
