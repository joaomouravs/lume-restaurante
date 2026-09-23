// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Domínio público do site. Na Vercel, usa automaticamente a URL de produção do projeto;
// ao conectar um domínio próprio, defina SITE_URL (ex.: https://lumerestaurante.com.br).
const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'never',
  integrations: [sitemap()],
  prefetch: {
    // Páginas pré-carregadas no hover: a cortina de transição cobre o tempo restante
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  image: {
    // Controlamos os estilos responsivos manualmente via CSS
    responsiveStyles: false,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
