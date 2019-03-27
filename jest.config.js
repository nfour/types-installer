module.exports = {
  "verbose": true,
  "transform": { ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js" },
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  "moduleFileExtensions": [ "ts", "tsx", "js", "json" ],
  "coverageDirectory": ".coverage",
  "coverageReporters": ['text', 'text-summary'],
  "coverageThreshold": {
    "global": { lines: 50 }
  },
  "testPathIgnorePatterns": [
    "/node_modules/",
    "./dist"
  ]
}
