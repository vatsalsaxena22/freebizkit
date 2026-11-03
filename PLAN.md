# FreeBizKit build plan

1. **Foundation** — DONE. TanStack Start + Tailwind on Netlify, FreeBizKit theme (paper/ink palette, Plex + Bricolage fonts), print styles, SEO head helpers (`src/lib/site.ts`).
2. **Calculator engine** — DONE. Pure formulas with tests (`src/calculators/formulas.ts`) and a registry with SEO copy, formulas, examples and FAQs for GST, margin, markup, discount, freelance rate and ROI (`src/calculators/registry.ts`).
3. **Document engine** — DONE. Document model + totals with tests, invoice/quotation/receipt configs, sample data.
4. **UI components** — DONE (not yet mounted). Header, footer, logo, breadcrumbs/FAQ/related sections, `CalculatorView`, `DocumentEditor` (autosave to localStorage, logo, accent, print-to-PDF), `DocumentPreview`.
5. **Routes** — NEXT. Replace `src/routes/index.tsx` with the home page; add `tools.index.tsx`, `tools.$slug.tsx`, `calculators.index.tsx`, `calculators.$slug.tsx` (use `pageHead` + `faqJsonLd`, `throw notFound()` for unknown slugs); mount `SiteHeader`/`SiteFooter` in `__root.tsx` and set siteName/description.
6. **Static pages** — pricing, about, contact + feedback/“suggest a tool” (Netlify Forms), privacy, terms; robots.txt and sitemap.
7. **Accounts & saved documents** — Netlify Identity, Netlify Database (profiles, documents), dashboard.
8. **Logo storage** — move logos to Netlify Blobs for signed-in users.
9. **More tools, templates, optional rate-limited AI helper, monetisation.**
