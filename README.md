# FreeBizKit

Free business tools for freelancers and small businesses, built with TanStack Start, React 19, Vite 8, Tailwind CSS 4, and Netlify.

## What’s included

- A searchable, responsive directory of nine working tools.
- Invoice, quotation, and receipt editors with live totals, currency, taxes, discounts, notes, logos, brand colors, and browser PDF export.
- GST, profit margin, markup, discount, freelance hourly rate, and ROI calculators with formulas, examples, FAQs, and related tools.
- Three free document templates, honest free pricing, about, contact, privacy, and terms pages.
- Optional Netlify Identity accounts with email confirmation, password recovery, and a cloud workspace.
- Editable documents and reusable business profiles in Netlify Database; private account logos in Netlify Blobs.
- Contact, feedback, and tool suggestions through a single categorized Netlify Form.

## Local development

```sh
pnpm install
netlify dev --port 8889
```

Use the Netlify dev proxy for Identity, Functions, and Blobs emulation. Public tools work without an account. Account and saved-data integration require Netlify services; migrations are applied automatically by the deployment platform. Never apply migrations manually.

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
```

## Architecture and credit use

The 18 public routes are explicitly configured for prerendering. Tool calculations, editing, and PDF export run in the browser. Account pages hydrate in the browser and request private data only when needed. No AI inference, payment service, advertising, or background polling is enabled.

Unsaved document edits live only in the current tab. Users explicitly choose to save a document or logo. Public calculators make no backend calls. The cloud workspace supports up to 100 documents per account. Saved documents retain structured input data and computed totals, rather than PDF binaries.

`netlify/functions/workspace.mts` handles document and profile operations. Every query is scoped to the authenticated user. Inputs are validated, writes are rate limited to 30 per minute per user using persistent database counters, and concurrent creates are serialized to enforce the document cap. `netlify/functions/logo.mts` validates file signatures, restricts images to PNG/JPEG/WebP, caps uploads at 300 KB, and allows only the owner to access their logo.

The initial SQL migration is in `netlify/database/migrations/`. Netlify applies it before publishing the deployment. Forms and Identity feature activation markers are included. The static form definition is `public/__forms.html`; SSR form submissions post directly there.

## Export

Choose **Download PDF**, then **Save as PDF** in the browser print dialog. Use A4 or Letter, and disable browser headers and footers for a clean document. Document printing uses a dedicated print layout and repeating table headers. Export important documents before clearing the workspace.

## SEO and release checks

Each public tool has its own canonical URL, title, description, explanatory content, and FAQ metadata. `public/sitemap.xml` and `robots.txt` use the production domain `https://freebizkit.netlify.app`. Update the domain in `src/lib/site.ts`, the sitemap, and robots file together when adding a custom domain.

The deploy platform validates production builds automatically. Verify email confirmation/recovery delivery, authenticated cloud CRUD, logo upload, and an actual contact submission on the deployed preview before launch. Local unit tests cover formulas, document totals, UI controls, and workspace ownership/validation. Monitor actual Netlify account credit consumption; traffic costs and platform pricing are not guaranteed by this app.

## Next steps

See [PLAN.md](PLAN.md). Premium packs, paid checkout, advanced generators, AI helpers, and analytics remain optional future work. No future feature is represented as a working paid product.
