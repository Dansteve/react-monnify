/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/libs/test/**/*.test.ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/libs/test/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {tsconfig: '<rootDir>/tsconfig.json'}],
  },
};
