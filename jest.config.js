module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  projects: [
    {
      displayName: 'auth-service',
      testMatch: ['<rootDir>/packages/auth-service/src/**/*.test.ts'],
    },
    {
      displayName: 'user-service',
      testMatch: ['<rootDir>/packages/user-service/src/**/*.test.ts'],
    },
    {
      displayName: 'practice-service',
      testMatch: ['<rootDir>/packages/practice-service/src/**/*.test.ts'],
    },
    {
      displayName: 'evaluation-service',
      testMatch: ['<rootDir>/packages/evaluation-service/src/**/*.test.ts'],
    },
    {
      displayName: 'scheduling-service',
      testMatch: ['<rootDir>/packages/scheduling-service/src/**/*.test.ts'],
    },
    {
      displayName: 'analytics-service',
      testMatch: ['<rootDir>/packages/analytics-service/src/**/*.test.ts'],
    },
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/*/src/**/*.test.ts',
    '!packages/*/src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  moduleNameMapper: {
    '^@tingwu/(.*)$': '<rootDir>/packages/$1/src',
  },
  testTimeout: 30000,
  verbose: true,
};
