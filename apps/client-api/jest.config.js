module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/client-api',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  displayName: 'client-api',
};
