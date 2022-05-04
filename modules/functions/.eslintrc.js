module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "../../.eslintrc.js",
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
  plugins: ["node"],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": [
      "error",
      {
        ignore: ["firebase-*"],
      },
    ],
  },
};
