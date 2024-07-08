import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


  export default [
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    { files: ["**/*.jsx"], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
    pluginReactConfig,
    {settings: {
      react: {
        version: "18.2",
      },
    }
  }, {
    rules: {
      "react/react-in-jsx-scope": "off", // Disable the rule requiring React in scope
    },
  },
  ];
  


