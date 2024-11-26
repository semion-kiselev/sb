import globals from "globals";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

console.log(pluginJs.configs.recommended)
console.log(...tsEslint.configs.recommended)

export default [
  {languageOptions: { globals: globals.nodeBuiltin }},
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
];
