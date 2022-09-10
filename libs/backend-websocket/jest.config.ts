const config = {
  coverageDirectory: '../../coverage/libs/backend-websocket',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  displayName: 'backend-websocket',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  preset: '../../jest.preset.js',
  resolver: '../../tools/js/jest-nestjs-resolver.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
};

export default config;
