module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testMatch: ['**/test/**/*.(spec|test).{ts,tsx}'],
  testURL: 'http://localhost',
  watchPlugins: [require.resolve('jest-watch-typeahead/filename'), require.resolve('jest-watch-typeahead/testname')],
  modulePaths: ['<rootDir>/src/', '<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 75,
      lines: 85,
      statements: 85,
    },
  },
  setupFiles: ['<rootDir>/jest.setup.ts'],
};
