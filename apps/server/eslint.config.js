import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {languageOptions: { globals: globals.nodeBuiltin }},
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
];
