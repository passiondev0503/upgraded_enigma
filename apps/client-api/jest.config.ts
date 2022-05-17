const config = {
  coverageDirectory: '../../coverage/apps/client-api',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  displayName: 'client-api',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  preset: '../../jest.preset.js',
  resolver: '../../tools/js/jest-node-resolver.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
};

export default config;
