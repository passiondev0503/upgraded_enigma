const jestPresetAngularSerializers = require('jest-preset-angular/build/serializers');

const config = {
  coverageDirectory: '../../coverage/libs/client-store-diagnostics',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 80,
      lines: 97,
      statements: 94,
    },
  },
  displayName: 'client-store-diagnostics',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  snapshotSerializers: jestPresetAngularSerializers,
};

export default config;
