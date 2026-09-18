import { createRequire } from 'node:module';
import {
  defineConfig,
  presetWind4,
  transformerVariantGroup,
  presetTypography,
  presetIcons,
  transformerDirectives
} from 'unocss';

export const defaultPreset = presetWind4({
  preflights: {
    reset: true
  }
});

/**
 * `presetIcons` only wires up its filesystem loader when it believes it is not
 * running inside VS Code -- it treats `process.env.VSCODE_CWD` as "I am the
 * editor extension, there is no disk to read from". The integrated terminal
 * exports that variable too, so any build started from it silently produced a
 * site with every icon missing. Loading the collections ourselves sidesteps the
 * detection, so icons resolve the same way everywhere.
 */
const fromIconifyJSON = (name: string) => async () => {
  const { loadCollectionFromFS } = await import('@iconify/utils/lib/loader/fs');

  return (await loadCollectionFromFS(name)) ?? { prefix: name, icons: {} };
};

/**
 * Every prefix `@iconify/json` ships, taken from its own index rather than
 * listed by hand: a hardcoded list fails silently the first time someone
 * reaches for an icon set that is not on it.
 */
const iconCollections = Object.keys(
  createRequire(import.meta.url)('@iconify/json/collections.json') as Record<string, unknown>
);

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(astro|html|js|jsx|json|md|mdx|svelte|ts|tsx|vue)($|\?)/
      ]
    }
  },
  presets: [
    defaultPreset,
    presetTypography(),
    presetIcons({
      warn: true,
      unit: '%',
      scale: 100,
      collections: Object.fromEntries(
        iconCollections.map(name => [name, fromIconifyJSON(name)])
      )
    })
  ],
  transformers: [
    transformerVariantGroup(),
    /**
     * `enforce: 'pre'` is required, not cosmetic. Without it the directive
     * transformer runs in Vite's default stage, which in dev is after CSS has
     * already been processed -- so `--at-apply` reached the browser verbatim
     * and every `.btn` rendered as unstyled text. Production builds order the
     * stages differently and happened to work, which hid the bug.
     */
    transformerDirectives({ enforce: 'pre' })
  ]
});
