import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageDirectory: '../../coverage/libs/backend-diagnostics',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 0,
      functions: 33,
      lines: 51,
      statements: 54,
    },
  },
  displayName: 'backend-diagnostics',
  preset: '../../jest.preset.js',
  globals: {},
  resolver: '../../tools/js/jest-nestjs-resolver.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
};

export default config;
