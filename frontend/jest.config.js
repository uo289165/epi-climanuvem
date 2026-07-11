module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/__tests__'],
  moduleNameMapper: {
    '^@/src/config/firebaseConfig$': '<rootDir>/__tests__/mocks/firebaseConfigMock.ts',
    '^@/src/services/LoggerService$': '<rootDir>/__tests__/mocks/LoggerServiceMock.ts',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!**/__tests__/**',
    '!**/mocks/**',
    '!src/config/firebaseConfig.ts',
    '!src/config/locales/**',
    '!**/*.d.ts',
  ],
};
