module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"]
  },

  rules: {
    "prettier/prettier": "error",

    "@typescript-eslint/no-floating-promises": "error",

    // Possible Errors
    "no-async-promise-executor": "error",
    "no-await-in-loop": "error",
    "no-misleading-character-class": "error",
    "no-template-curly-in-string": "error",

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
    "@typescript-eslint/no-use-before-define": "off"
  },

  ignorePatterns: ["node_modules", "dist"],

  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    
    "prettier",
    "plugin:prettier/recommended" /* recommends being the last in list */
  ],

  extends: ["prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  },
}

/*  

    // Possible Errors
    "no-async-promise-executor": "error",
    "no-await-in-loop": "error",
    "no-misleading-character-class": "error",
    "no-template-curly-in-string": "error",

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
        "allowDestructuring": true
      }
      ],
    "@typescript-eslint/no-use-before-define": "off"
*/
