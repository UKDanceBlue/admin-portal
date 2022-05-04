module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "../../.eslintrc.js",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
  ],
  ignorePatterns: [
    "/dist/**/*", // Ignore built files.
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: [
    "react"
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
