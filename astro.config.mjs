import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Domínio usado para gerar as URLs absolutas do sitemap.
  site: 'https://www.mariahelenatorres.com',
  integrations: [sitemap()],
});
