module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!tests/**',
    '!server.js',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov', 
    'html',
    'json-summary'
  ],
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/testHelpers.js'],
  verbose: true,
  collectCoverage: false, // Set to true when running coverage
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
