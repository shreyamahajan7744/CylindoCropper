module.exports = {
  extends: ["react-app"],
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
    project: "tsconfig.json",
  },
};
