const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-diagnostics',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 0,
      functions: 50,
      lines: 86,
      statements: 87,
    },
  },
  displayName: 'client-diagnostics',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
