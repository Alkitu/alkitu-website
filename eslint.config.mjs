import next from 'eslint-config-next'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '.next/**',
      '.contentlayer/**',
      'node_modules/**',
      'export/**',
      'knowledge-brain-kit/**',
      'next-env.d.ts',
      // vendored third-party bundles, not our source
      'public/js/**',
    ],
  },
  ...next,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Existing debt, kept visible as warnings so the gate stays honest.
      // `next lint` was broken from the Next.js 16 upgrade until 2026-08, so
      // none of these ever ran. Promote back to 'error' as they get paid down.
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
  {
    // Config files and scripts are CommonJS by design.
    files: ['**/*.js', '**/*.cjs', 'scripts/**'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]
