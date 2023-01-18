module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"]
  },

  rules: {
    "prettier/prettier": "error",

    // TypeScript-ESLint (Prettier)
    "@typescript-eslint/member-delimiter-style": "off",

    // TypeScript-ESLint
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/no-this-alias": [
      "error",
      {
        allowDestructuring: true
      }
    ],
    "@typescript-eslint/no-use-before-define": "off",

    ignorePatterns: ["node_modules", "dist", ".eslintrc.js"],

    plugins: ["@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",

      "prettier",
      "plugin:prettier/recommended" /* recommended listing it at last */
    ],

    extends: ["prettier"],
    plugins: ["prettier"],
    rules: {
      // "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    },
  }
}
