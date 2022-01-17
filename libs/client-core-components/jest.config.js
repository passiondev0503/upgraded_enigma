const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/client-core-components',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
  displayName: 'client-core-components',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 61,
      functions: 72,
      lines: 85,
      statements: 88,
    },
  },
};