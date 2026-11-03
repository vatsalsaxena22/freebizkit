# FreeBizKit

Free, browser-first business tools for freelancers and small businesses: invoice, quotation and receipt generators plus GST, margin, markup, discount, freelance-rate and ROI calculators. Designed to stay mostly static so it fits the Netlify Free plan.

**Stack:** TanStack Start (React 19, Vite 8), Tailwind CSS 4, shadcn/ui, TypeScript, Netlify. Later: Netlify Identity, Database and Blobs.

## Run locally
```bash
pnpm install
netlify dev --port 8889   # or: npm run dev
npm test                  # formula and totals tests
```

## Roadmap
See [PLAN.md](PLAN.md). Next up: wiring the finished components into the home, tools and calculator routes, then the legal/contact pages, accounts, and saved documents.
