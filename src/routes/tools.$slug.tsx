import { createFileRoute, notFound } from '@tanstack/react-router'
import { getGenerator } from '@/generators/registry'
import { DocumentEditor } from '@/components/document-editor'
import { Breadcrumbs, HowItWorks, FaqSection, RelatedTools } from '@/components/page-sections'
import { pageHead, faqJsonLd } from '@/lib/site'
export const Route = createFileRoute('/tools/$slug')({
  loader: ({ params }) => {
    const gen = getGenerator(params.slug)
    if (!gen) throw notFound()
    return gen.slug
  },
  head: ({ loaderData }) => {
    const g = getGenerator(loaderData ?? '')
    return g
      ? {
          ...pageHead({
            title: g.seoTitle,
            description: g.seoDescription,
            path: `/tools/${g.slug}`,
          }),
          scripts: [faqJsonLd(g.faqs)],
        }
      : {}
  },
  component: Page,
})
function Page() {
  const gen = getGenerator(Route.useLoaderData())!
  return (
    <main className="mx-auto max-w-content space-y-12 px-4 py-10 sm:px-6 print:contents">
      <div className="space-y-5 print:hidden">
        <Breadcrumbs section="tools" current={gen.name} />
        <h1 className="font-display text-4xl font-semibold tracking-tight">{gen.h1}</h1>
        <p className="max-w-3xl leading-7 text-muted-foreground">{gen.intro}</p>
      </div>
      <DocumentEditor key={gen.slug} gen={gen} />
      <div className="space-y-12 print:hidden">
        <HowItWorks steps={gen.howTo} />
        <FaqSection faqs={gen.faqs} />
        <RelatedTools
          generatorSlugs={gen.related}
          calculatorSlugs={['gst-calculator', 'profit-margin-calculator']}
        />
      </div>
    </main>
  )
}
