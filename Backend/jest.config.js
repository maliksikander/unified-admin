module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules','route.js'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  testResultsProcessor: "jest-sonar-reporter",
  testTimeout: 500000
};
