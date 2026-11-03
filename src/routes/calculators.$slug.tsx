import { createFileRoute, notFound } from '@tanstack/react-router'
import { getCalculator } from '@/calculators/registry'
import { CalculatorView } from '@/components/calculator-view'
import { Breadcrumbs, HowItWorks, FaqSection, RelatedTools } from '@/components/page-sections'
import { pageHead, faqJsonLd } from '@/lib/site'
export const Route = createFileRoute('/calculators/$slug')({
  loader: ({ params }) => {
    const calc = getCalculator(params.slug)
    if (!calc) throw notFound()
    return calc.slug
  },
  head: ({ loaderData }) => {
    const c = getCalculator(loaderData ?? '')
    return c
      ? {
          ...pageHead({
            title: c.seoTitle,
            description: c.seoDescription,
            path: `/calculators/${c.slug}`,
          }),
          scripts: [faqJsonLd(c.faqs)],
        }
      : {}
  },
  component: Page,
})
function Page() {
  const calc = getCalculator(Route.useLoaderData())!
  return (
    <main className="mx-auto max-w-content space-y-12 px-4 py-10 sm:px-6">
      <div className="space-y-5">
        <Breadcrumbs section="calculators" current={calc.name} />
        <h1 className="font-display text-4xl font-semibold tracking-tight">{calc.h1}</h1>
        <p className="max-w-3xl leading-7 text-muted-foreground">{calc.intro}</p>
      </div>
      <CalculatorView key={calc.slug} calc={calc} />
      <HowItWorks steps={calc.howTo} />
      <section className="rounded-xl border bg-secondary/40 p-7">
        <h2 className="font-display text-2xl font-semibold">The math, explained</h2>
        <div className="my-5 space-y-2">
          {calc.formula.expression.map((e) => (
            <p key={e} className="tabular text-sm">
              {e}
            </p>
          ))}
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{calc.formula.example}</p>
      </section>
      <FaqSection faqs={calc.faqs} />
      <RelatedTools calculatorSlugs={calc.related} generatorSlugs={['invoice-generator']} />
    </main>
  )
}
