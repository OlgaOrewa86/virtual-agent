export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      env: {
        node: true,
        es2021: true,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },

  {
    files: ["tests/**/*.test.js"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      env: {
        jest: true,
      },
    },
    rules: {
      "no-undef": "off",
    },
  },
];
