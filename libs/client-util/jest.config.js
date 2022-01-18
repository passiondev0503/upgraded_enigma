const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/libs/client-util',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
  displayName: 'client-util',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 28,
      functions: 6,
      lines: 6,
      statements: 7,
    },
  },
};
