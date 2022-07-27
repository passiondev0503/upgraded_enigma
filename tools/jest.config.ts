const config = {
  coverageDirectory: '../coverage/tools',
  coverageThreshold: {
    global: {
      branches: 77,
      functions: 95,
      lines: 98,
      statements: 98,
    },
  },
  displayName: 'tools',
  preset: '../jest.preset.js',
};

export default config;
