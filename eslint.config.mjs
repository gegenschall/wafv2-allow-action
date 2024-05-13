// @ts-check
import typescriptEslint from 'typescript-eslint'
import eslint from '@eslint/js'

export default typescriptEslint.config(
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    ignores: ['dist/', 'lib/', 'node_modules/', 'jest.config.js']
  }
)
