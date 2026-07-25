import { getAllPackagePaths } from '@caise2027-website/configs/utils';
import { defineConfig } from 'eslint/config';
import eslintImportX from 'eslint-plugin-import-x';
import globals from 'globals';

/**
 * Gets the ESLint config from Node.js and development related files
 * @param files - Defaults to `*config.*` and files under `scripts` folder
 */
export function getNodeFiles(packageName: string, files = ['*.config.*', 'scripts/**/*.ts']) {
  return defineConfig([{
    name: '(@caise2027-website/configs/lint/env) Node.js and development-related files',
    files,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.nodeBuiltin
      }
    },
    plugins: {
      // @ts-expect-error - Missing types from package
      'import-x': eslintImportX
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          packageDir: [...getAllPackagePaths()]
        }
      ],
      'import-x/no-nodejs-modules': 'off',
      'unicorn/no-process-exit': 'off'
    }
  }
  ]);
}

/**
 * Gets the rules config for WebWorker files
 * @param files - Defaults to `*.worker.ts` files
 */
export function getWorkerFiles(files = ['**/*.worker.ts']) {
  return defineConfig([{
    name: '(@caise2027-website/configs/lint/env) WebWorkers',
    files,
    languageOptions: {
      globals: {
        ...globals.worker
      }
    }
  }]);
}
