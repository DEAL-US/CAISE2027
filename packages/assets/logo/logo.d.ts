import type { ImageMetadata } from 'astro';

declare module '@caise2027-website/assets/logo' {
  const logo: ImageMetadata;
  export default logo;
}
