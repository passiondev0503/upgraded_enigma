const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-core-components',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
  displayName: 'client-core-components',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 68,
      functions: 96,
      lines: 96,
      statements: 96,
    },
  },
  preset: '../../jest.preset.ts',
};

export default config;
