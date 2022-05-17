const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-workspaces',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  displayName: 'client-workspaces',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
