module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react-hooks', '@typescript-eslint'],
  rules: {
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-use-before-define': [0],
    'no-param-reassign': 'off',
    'react/no-danger': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-use-before-define': [1],
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'] }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': ['off']
  },
  extends: [
    'prettier',
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  settings: { 'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'] } } }
};
