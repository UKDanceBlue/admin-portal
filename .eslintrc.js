//
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parserOptions: {
    project: ["./tsconfig.eslint.json", "./modules/*/tsconfig.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "import",
  ],
};
