module.exports = {
  "parserOptions": {
    "ecmaVersion": 5
  },
  "extends": [
    "airbnb-base",
    "plugin:jest/recommended"
  ],
  "plugins": [
    "jest",
    "import",
  ],
  "env": {
    "node": true,
    "jest": true
  },
  "rules": {
    "jest/no-identical-title": "error",
    "jest/valid-expect": "error",
    "prefer-object-spread": 0,
  }
};
