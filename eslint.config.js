import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.next/',
      'node_modules/',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      jsxA11y,
      react,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'import/no-duplicates': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-anonymous-default-export': 'off',
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': [
        'warn',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferSamePage'],
        },
      ],
      'jsx-a11y/heading-has-content': 'off',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'react/boolean-prop-naming': 'warn',
      'react/default-props-match-prop-types': 'warn',
      'react/display-name': 'off',
      'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
      'react/forbid-prop-types': ['warn', { skipUndeclared: true }],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-boolean-value': 'warn',
      'react/jsx-closing-bracket-location': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
      'react/jsx-curly-newline': 'warn',
      'react/jsx-equals-spacing': 'warn',
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/jsx-first-prop-newline': [
        'warn',
        { multiline: 'multiline' },
      ],
      'react/jsx-handler-names': 'warn',
      'react/jsx-max-props-per-line': 'warn',
      'react/jsx-no-bind': [
        'warn',
        {
          allowArrowFunctions: true,
          allowBind: false,
          allowRef: false,
        },
      ],
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-no-literals': 'off',
      'react/jsx-no-target-blank': 'warn',
      'react/jsx-no-undef': 'error',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-pascal-case': 'warn',
      'react/jsx-sort-default-props': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          shorthandLast: false,
        },
      ],
      'react/jsx-tag-spacing': 'warn',
      'react/jsx-target-blank': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'warn',
      'react/no-danger': 'warn',
      'react/no-danger-with-children': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-direct-mutation-state': 'warn',
      'react/no-find-dom-node': 'warn',
      'react/no-is-mounted': 'warn',
      'react/no-typos': 'warn',
      'react/no-unused-state': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/no-unused-values': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'warn',
      'react/require-render-return': 'warn',
      'react/self-closing-comp': 'warn',
      'react/sort-comp': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);