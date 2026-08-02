import pkg from './package.json' with { type: 'json' };
import {
  getBaseConfig,
  getImportAliasConfig,
  getNodeFiles,
  getTSVueConfig,
  tsFiles
} from '@caise2027-website/configs/lint';

export default [
  ...getBaseConfig(pkg.name),
  ...getImportAliasConfig(),
  ...getTSVueConfig(false, import.meta.dirname),
  ...getNodeFiles(tsFiles)
];
