module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/client-api',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  displayName: 'client-api',
  testEnvironment: 'node',
  coverageThreshold: {
    // TODO: bump unit test coverage and remove this override
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
};
