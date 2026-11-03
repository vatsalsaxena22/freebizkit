export const SITE_NAME = 'FreeBizKit'
export const SITE_TAGLINE = 'Free business tools that work in your browser'
export const SITE_DESCRIPTION =
  'Free invoice, quotation and receipt generators plus GST, margin, markup, discount, freelance rate and ROI calculators. No sign-up, no server uploads — everything runs in your browser.'
export const SITE_URL = 'https://freebizkit.netlify.app'

/** Build the standard per-page <head> meta set (title, description, OG, canonical). */
export function pageHead({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: `${SITE_URL}${path}` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}${path}` }],
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }),
  }
}
