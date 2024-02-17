// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: [
    '.eslintrc.cjs',
    
    // we need to duplicate gitignore information here :(
    // while we can pass in --ignore-path from cli,
    // ide doesn't recognize that
    'node_modules',
    'dist',
    'coverage',
    'dev-dist',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'import/extensions': ['error', 'ignorePackages'],
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'type'],
      'newlines-between': 'always',
      pathGroups: [
        // components
        {
          pattern: '**/*.tsx',
          group: 'internal',
          position: 'after',
        },
        // absolute imports (i.e. using `public` directory)
        {
          pattern: "/**",
          group: 'sibling',
          position: 'after',
        },
      ],
      distinctGroup: true,
    }],
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.test.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: { version: 'detect' },
    'import/internal-regex': '^@/',
  },
}

module.exports = config