module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/dist/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/dist/test/helpers/testSetup.js']
};
