const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-core-components',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 68,
      functions: 92,
      lines: 93,
      statements: 93,
    },
  },
  displayName: 'client-core-components',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
