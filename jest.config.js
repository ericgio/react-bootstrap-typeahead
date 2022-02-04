module.exports = {
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/propTypes',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules',
    '/cjs',
    '/es',
    '/example',
    '/types',
  ],
};
