module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["../../.eslintrc.json", "plugin:react/recommended", "plugin:react/jsx-runtime"],
  ignorePatterns: [
    "/dist/**/*", // Ignore built files.
    "**/build/static/js/*",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
    },
  },
};
