module.exports = {
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/example',
    '<rootDir>/src/propTypes',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  setupFiles: [
    '<rootDir>/jest.setup.js',
  ],
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};
