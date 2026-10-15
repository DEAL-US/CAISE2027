import { defineConfig } from 'unocss';
import config, { defaultPreset } from '@caise2027-website/configs/uno';

export default defineConfig({
  ...config,
  /**
   * UnoCSS does not extract class names from string literals inside `<script>`
   * blocks, so anything only ever toggled from JavaScript has to be listed
   * here. `h-screen` and `!overflow-hidden` are toggled by `BasicScripts` when
   * the mobile menu opens: without them the header kept `bg-page` but no
   * height, so the menu floated over the page with the content showing
   * through, and the body still scrolled behind it.
   */
  safelist: [
    'i-svg-spinners:ring-resize',
    'h-screen',
    '!overflow-hidden'
  ],
  rules: [
    /**
     * Radial plate behind the hero text, so it stays legible over the
     * background picture. It fades out from `--colors-page`, which follows the
     * theme.
     */
    ['text-bg-shadow', {
      background: `radial-gradient(
        ellipse closest-side,
        color-mix(in srgb, var(--colors-page) 80%, transparent) 0%,
        color-mix(in srgb, var(--colors-page) 75%, transparent) 30%,
        color-mix(in srgb, var(--colors-page) 65%, transparent) 50%,
        color-mix(in srgb, var(--colors-page) 40%, transparent) 85%,
        color-mix(in srgb, var(--colors-page) 30%, transparent) 92%,
        color-mix(in srgb, var(--colors-page) 15%, transparent) 95%,
        color-mix(in srgb, var(--colors-page) 8%, transparent) 97%,
        color-mix(in srgb, var(--colors-page) 0%, transparent) 100%
      )`
    }]
  ],
  theme: {
    colors: {
      'page': '#ffffff',
      'dark': '#030620',
      'primary': '#0161ef',
      'secondary': '#0154cf',
      // accent: '#6d28d9',
      'default': '#101010',
      'muted': '#101010a8',
      /**
       * Taken straight from the CAiSE 2027 logo, so headings match the brand
       * mark exactly. Used without a dark-mode variant on purpose: the hero
       * always renders dark, and a lightened red there reads as orange.
       */
      'brand': '#d71921',
      'brand-blue': '#16477e'
    },
    ease: {
      /* Overshoots and settles, for the home hero's buttons */
      bounce: 'linear(0, 0.0026, 0.0103 0.68%, 0.0438 1.44%, 0.1032, 0.1822 3.08%, 0.3639 4.58%, 0.8941 8.48%, 1.0301 9.64%, 1.1322 10.67%, 1.2199 11.76%, 1.2809 12.79%, 1.3023 13.27%, 1.3214, 1.3349, 1.343 14.91%, 1.346, 1.3417 16.28%, 1.3295, 1.3103 17.78%, 1.2829 18.6%, 1.2473 19.49%, 1.0516 23.67%, 1.0053 24.76%, 0.9699 25.72%, 0.9343, 0.9077, 0.8902, 0.8815 30.37%, 0.8802 31.05%, 0.8817, 0.886 32.56%, 0.8933 33.38%, 0.9155 35.09%, 0.9822 39.19%, 1.0096 41.18%, 1.0221 42.34%, 1.0311, 1.0372 44.53%, 1.0407 45.69%, 1.0411 47.2%, 1.0371 48.84%, 1.0292 50.62%, 1.0065 54.65%, 0.9969 56.63%, 0.9896, 0.9861 61.01%, 0.9871 64.36%, 1.0009 72.02%, 1.0047 76.2%, 1.0044 79.89%, 0.9986 90.63%, 0.9994 100%)'
    },
    font: {
      sans: ['InterVariable', defaultPreset.theme!.font!.sans].join(','),
      serif: ['InterVariable', defaultPreset.theme!.font!.serif].join(','),
      heading: ['InterVariable', defaultPreset.theme!.font!.sans].join(',')
    }
  }
});
