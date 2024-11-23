process.env.TZ = 'UTC';
process.env.SALT_ROUNDS = 10;

/** @type {import('jest').Config} */
const config = {
  transform: {
    "\\.[jt]sx?$": "@swc/jest",
  },
  testRegex: ".*\\.test\\.ts$",
  rootDir: "src",
  moduleNameMapper: {
    "(.+)\\.js$": "$1"
  },
};

module.exports = config;