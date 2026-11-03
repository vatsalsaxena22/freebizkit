import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    netlify(),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true,
      },
      pages: [
        '/',
        '/tools',
        '/calculators',
        '/templates',
        '/pricing',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        ...['invoice', 'quotation', 'receipt'].map((s) => `/tools/${s}-generator`),
        ...['gst', 'profit-margin', 'markup', 'discount', 'freelance-rate', 'roi'].map(
          (s) => `/calculators/${s}-calculator`,
        ),
      ].map((path) => ({ path, prerender: { enabled: true } })),
    }),
    viteReact(),
  ],
})

export default config
