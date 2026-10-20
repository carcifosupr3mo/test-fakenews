import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

// Modalità "standalone" -> UN SOLO file HTML autonomo (JS, CSS e icona incorporati), per l'uso da file://
//   (Electron/pacchetto PC, cartella portatile). Nessun service worker: non funzionerebbe da file://.
// Modalità "test"  -> build con strumenti di debug (per il PC di sviluppo)
// Modalità "production" -> build finale: il codice di debug viene rimosso
export default defineConfig(({ mode }) => {
  const standalone = mode === 'standalone';
  return {
  base: './',
  define: {
    __DEBUG_BUILD__: JSON.stringify(mode !== 'production' && !standalone),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.1.0'),
  },
  resolve: standalone ? { alias: { 'virtual:pwa-register': fileURLToPath(new URL('./src/pwa-stub.ts', import.meta.url)) } } : {},
  build: { target: 'es2020', sourcemap: mode === 'test', outDir: standalone ? 'dist-standalone' : 'dist', assetsInlineLimit: standalone ? 100_000_000 : 4096 },
  test: { include: ['tests/**/*.test.ts'] },
  plugins: standalone ? [viteSingleFile({ removeViteModuleLoader: true }), stripExternalLinks()] : [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'], navigateFallback: 'index.html' },
      manifest: {
        name: 'VERIFICA — La verità dietro lo schermo',
        short_name: 'VERIFICA',
        description: 'Videogioco investigativo su phishing, fake news e sicurezza digitale.',
        lang: 'it',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#f4efe6',
        theme_color: '#1f2a44',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
};
});

/** Nella build standalone rimuove i riferimenti a file esterni (icone, manifest) e incorpora l'icona. */
function stripExternalLinks() {
  const icon = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#1f2a44"/><circle cx="224" cy="224" r="112" fill="none" stroke="#f4efe6" stroke-width="36"/><path d="M308 308l108 108" stroke="#d9743f" stroke-width="44" stroke-linecap="round"/></svg>');
  return {
    name: 'strip-external-links',
    transformIndexHtml: (html: string) => html
      .replace(/<link rel="apple-touch-icon"[^>]*>\s*/g, '')
      .replace(/<link rel="manifest"[^>]*>\s*/g, '')
      .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="${icon}" type="image/svg+xml" />`),
  };
}
