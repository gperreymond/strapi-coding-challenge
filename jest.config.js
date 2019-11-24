// jest.config.js
module.exports = {
  automock: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'lcov'],
  collectCoverageFrom: ['graphql/**/*.js', 'modules/**/*.js', 'services/**/*.js'],
  coveragePathIgnorePatterns: ['node_modules']
}
