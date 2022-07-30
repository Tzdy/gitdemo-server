module.exports = {
    preset: 'ts-jest',

    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^test/(.*)$': '<rootDit>/test/$1',
    },
  }

