const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/client-store',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
  displayName: 'client-store',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 18,
      functions: 22,
      lines: 28,
      statements: 28,
    },
  },
};
