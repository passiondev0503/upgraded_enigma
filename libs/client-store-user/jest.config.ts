const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-store-user',
  coverageThreshold: {
    // TODO: complete the store logic and increase unit test coverage
    global: {
      branches: 35,
      functions: 47,
      lines: 74,
      statements: 74,
    },
  },
  displayName: 'client-store-user',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
