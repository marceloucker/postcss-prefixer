module.exports = {
  "extends": [
    "airbnb-base",
    "plugin:jest/recommended"
  ],
  "plugins": [
    "import",
    "jest"
  ],
  "env": {
    "jest/globals": true
  },
  "rules": {
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error"
  }
};
