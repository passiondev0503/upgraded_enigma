const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-store',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 28,
      functions: 37,
      lines: 66,
      statements: 67,
    },
  },
  displayName: 'client-store',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
