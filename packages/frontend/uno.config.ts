import { defineConfig } from 'unocss';
import config, { defaultPreset } from '@caise2027-website/configs/uno';

export default defineConfig({
  ...config,
  safelist: ['i-svg-spinners:ring-resize'],
  theme: {
    colors: {
      page: '#ffffff',
      dark: '#030620',
      primary: '#0161ef',
      secondary: '#0154cf',
      // accent: '#6d28d9',
      default: '#101010',
      muted: '#101010a8',
      /**
       * Taken straight from the CAiSE 2027 logo, so headings match the brand
       * mark exactly. Used without a dark-mode variant on purpose: the hero
       * always renders dark, and a lightened red there reads as orange.
       */
      brand: '#d71921',
      'brand-blue': '#16477e'
    },
    font: {
      sans: ['InterVariable', defaultPreset.theme!.font!.sans].join(','),
      serif: ['InterVariable', defaultPreset.theme!.font!.serif].join(','),
      heading: ['InterVariable', defaultPreset.theme!.font!.sans].join(',')
    }
  }
});
