module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: [
    'react',
  ],
  rules: {
    "comma-dangle": "off",
    "global-require": "off",
    "max-len": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": "off",
    "no-console": "off",
    "array-bracket-spacing": ["error", "always"],
    "consistent-return": "off",
    "no-await-in-loop": "off",
    "camelcase": "off",
    "no-unused-expressions": "off",
    "no-param-reassign": "off"
  },
};
