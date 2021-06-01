module.exports = {
  rootDir: 'src',
  preset: 'ts-jest',
  testRegex: '.spec.ts$',
  testEnvironment: 'node',
  coverageDirectory: '../coverage',
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFiles: ['../test/jest-setup-file.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
