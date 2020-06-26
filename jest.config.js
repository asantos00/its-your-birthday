module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
   ],
   transform: {
    "^.+\\.tsx?$": "ts-jest"
   },
   testMatch: [
    "**/*.(test|spec).(ts|tsx)"
   ],
   globals: {
    "ts-jest": {
      babelConfig: true,
      diagnostics: false
    }
   },
};
