const config = {
  coverageDirectory: '../coverage/tools',
  coverageThreshold: {
    global: {
      branches: 76,
      functions: 87,
      lines: 87,
      statements: 86,
    },
  },
  displayName: 'tools',
  preset: '../jest.preset.js',
};

export default config;
