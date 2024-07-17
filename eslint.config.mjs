import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["**/build/**", "**/node_modules/**", "**/public/*"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, es2021: true },
      parser: tsParser,
      ecmaVersion: "latest", // Tambahkan ini
      sourceType: "module", // Tambahkan ini
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
