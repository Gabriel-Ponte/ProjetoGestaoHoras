import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactHooks from "eslint-plugin-react-hooks";
import eslintReact from "@eslint-react/eslint-plugin";

export default [
  // Without this, ESLint lints its own build output: the minified bundles in
  // build/ were producing ~385 of the ~418 reported errors (no-prototype-builtins,
  // no-fallthrough, ... — all from minified vendor code), which made `npm run lint`
  // useless. Source files are what we actually want to lint.
  {
    ignores: ["build/**", "dist/**", "node_modules/**"],
  },

  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  { files: ["**/*.jsx"], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },

  // ---------------------------------------------------------------------------
  // eslint-plugin-react is effectively UNMAINTAINED (last release 2025-04) and is
  // what pins this project to ESLint 9 (its peer range stops at ^9.7).
  //
  // It is kept anyway, because it is the ONLY source of two things:
  //   1. react/jsx-uses-vars — ESLint core does not treat `<Foo />` as a use of
  //      `Foo`. Measured: drop this plugin and `no-unused-vars` goes 17 -> 348
  //      false positives.
  //   2. react/prop-types — this is a plain-JS codebase that validates props with
  //      PropTypes in ~55 files. @eslint-react is TypeScript-first and dropped it.
  //
  // Staying on ESLint 9 is an acceptable price: ESLint 10 is dev-only tooling and
  // ships nothing this project needs.
  // ---------------------------------------------------------------------------
  pluginReactConfig,

  // ---------------------------------------------------------------------------
  // @eslint-react is the actively maintained successor (releases most weeks). It
  // is NOT a drop-in replacement — see above — so it runs ALONGSIDE the old plugin,
  // contributing the modern rules the old one never had: setState-in-effect,
  // array-index keys, leaked listeners/timeouts, render purity, ...
  // ---------------------------------------------------------------------------
  eslintReact.configs.recommended,
  // Turns OFF the 40 eslint-plugin-react rules that overlap with @eslint-react, so
  // an issue is not reported twice. CAREFUL: it also switches off `react/prop-types`
  // (@eslint-react is TypeScript-first and treats PropTypes as legacy). It does NOT
  // touch `react/jsx-uses-vars`, which is the one we cannot live without.
  eslintReact.configs["disable-conflict-eslint-plugin-react"],
  // ...so put prop-types back: this is a plain-JS codebase that validates props with
  // PropTypes in ~55 files, and the rule finds 9 components missing validation.
  { rules: { "react/prop-types": "error" } },

  // Build/tooling files run in Node, not the browser (they use process, __dirname).
  {
    files: ["vite.config.js", "eslint.config.mjs", "generate-cert.js"],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: "module",
    },
  },

  // React Hooks rules. This plugin was NOT installed before, which is why a real
  // crash went unseen: AddUtilizador called useEffect after an early `return`, so
  // the hook count changed between renders.
  {
    files: ["**/*.{js,jsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Severity policy for the pre-existing backlog.
  //   error -> a definite bug (crash / leak). Never acceptable.
  //   warn  -> a real smell with a large existing backlog: visible, but it must not
  //            block work while it is burned down. Promote to "error" once clean.
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      // Definite bugs: an uncleaned listener/timer keeps the component alive.
      "@eslint-react/web-api-no-leaked-event-listener": "error",
      "@eslint-react/web-api-no-leaked-timeout": "error",
      "@eslint-react/web-api-no-leaked-interval": "error",

      // Backlog (counts at the time of writing).
      "@eslint-react/set-state-in-effect": "warn", // 137
      "@eslint-react/no-array-index-key": "warn", //  38

      // @eslint-react ships its own exhaustive-deps; keep only the React-team one
      // (react-hooks/exhaustive-deps, above) so a finding is not counted twice.
      "@eslint-react/exhaustive-deps": "off",
    },
  },

  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    rules: {
      // Not needed: @vitejs/plugin-react uses React's automatic JSX runtime.
      "react/react-in-jsx-scope": "off",
    },
  },
];
