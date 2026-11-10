import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Fonts each page paints first: body face everywhere, plus the page's display face.
const DISPLAY = { urbis: 'manrope', healthsearch: 'archivo', caritas: 'sora' }

// Build only: adds <link rel="preload"> for those two font files, using their hashed names from the bundle.
const preloadFonts = {
  name: 'preload-fonts',
  transformIndexHtml(html, ctx) {
    if (!ctx.bundle) return html
    const display = Object.entries(DISPLAY).find(([slug]) => ctx.path.includes(slug))?.[1] ?? 'libre-baskerville'
    return ['inter', display].flatMap((family) =>
      Object.keys(ctx.bundle)
        .filter((file) => file.includes(`/${family}-latin-`))
        .map((file) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' }, injectTo: 'head' })),
    )
  },
}

// Multi-page build: each page keeps its own HTML (title, meta, canonical) for SEO and link previews.
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        urbis: 'projetos/urbis/index.html',
        healthsearch: 'projetos/healthsearch/index.html',
        caritas: 'projetos/caritas/index.html',
      },
    },
  },
})
