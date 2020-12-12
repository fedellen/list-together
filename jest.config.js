module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/test/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/helpers/testSetup.ts']
};
