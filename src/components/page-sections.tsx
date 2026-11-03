import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getCalculator } from '@/calculators/registry'
import { getGenerator } from '@/generators/registry'

export function Breadcrumbs({ section, current }: { section: 'tools' | 'calculators'; current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground print:hidden">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link to={section === 'tools' ? '/tools' : '/calculators'} className="hover:text-foreground">
            {section === 'tools' ? 'Document tools' : 'Calculators'}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-foreground" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  )
}

export function HowItWorks({ steps }: { steps: string[] }) {
  return (
    <section aria-labelledby="how-heading">
      <h2 id="how-heading" className="font-display text-2xl font-bold tracking-tight">
        How it works
      </h2>
      <ol className="mt-5 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={i} className="rounded-lg border bg-card p-5">
            <span className="tabular text-sm font-semibold text-primary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="mt-2 text-sm leading-relaxed">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function FaqSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-2xl font-bold tracking-tight">
        Common questions
      </h2>
      <Accordion type="multiple" className="mt-4 rounded-lg border bg-card px-5">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-base">{f.q}</AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

export function RelatedTools({
  calculatorSlugs = [],
  generatorSlugs = [],
}: {
  calculatorSlugs?: string[]
  generatorSlugs?: string[]
}) {
  const calcs = calculatorSlugs.map(getCalculator).filter((c) => c !== undefined)
  const gens = generatorSlugs.map(getGenerator).filter((g) => g !== undefined)
  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-display text-2xl font-bold tracking-tight">
        Related tools
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gens.map((g) => (
          <li key={g.slug}>
            <Link
              to="/tools/$slug"
              params={{ slug: g.slug }}
              className="group flex h-full items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary motion-reduce:transition-none"
            >
              <g.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="flex items-center gap-1 font-medium">
                  {g.name}
                  <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </span>
                <span className="text-sm text-muted-foreground">{g.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
        {calcs.map((c) => (
          <li key={c.slug}>
            <Link
              to="/calculators/$slug"
              params={{ slug: c.slug }}
              className="group flex h-full items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary motion-reduce:transition-none"
            >
              <c.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <span>
                <span className="flex items-center gap-1 font-medium">
                  {c.name}
                  <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </span>
                <span className="text-sm text-muted-foreground">{c.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
