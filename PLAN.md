# FreeBizKit build plan

1. **Foundation — complete.** TanStack Start, responsive FreeBizKit theme, accessible header/mobile navigation/footer, metadata helpers and favicon.
2. **Calculators — complete.** Six tested engines mounted on dedicated landing pages: GST, margin, markup, discount, freelance hourly rate and ROI. Instant results, reset, copy, formulas, examples and FAQs.
3. **Documents and export — complete.** Invoice, quotation and receipt editors with item rows, totals, branding, optional logos, live preview and browser print/PDF. Unsaved state stays in the active tab; no localStorage document persistence.
4. **Public experience — complete.** Searchable home and tool directories, three free templates, pricing, about, contact/feedback/suggestions, privacy and terms.
5. **Accounts and saving — implemented.** Netlify Identity login/signup, confirmation and recovery callbacks. Database-backed documents and business profiles. Dashboard opens and deletes editable documents and clears cloud workspace. Account closure requests use the contact form.
6. **Logo storage — implemented.** Private Netlify Blobs upload/read/delete, ownership checks, raster MIME/signature checks and 300 KB limit. Anonymous logos are transient browser data.
7. **SEO and infrastructure — implemented.** Public-route prerender configuration, canonical metadata, tool FAQ schemas, sitemap and robots. Database migration and Forms/Identity activation markers included. No AI or payment dependencies.
8. **Release verification — remaining platform step.** The platform runs the production build and migrations. After deploy, verify real email delivery, signed-in document/profile/logo persistence, and contact intake. Local browser checks cover public tools, navigation and PDF; API unit tests cover ownership and validation.
9. **Future, outside MVP.** Advanced generators and calculators; paid template packs only after demand; optional tightly limited AI; account self-service deletion; usage measurement and credit monitoring. Keep the core free.
