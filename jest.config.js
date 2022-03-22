module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["**/src/**/*.js", "!**/src/main/**"],
  preset: "@shelf/jest-mongodb",
};
