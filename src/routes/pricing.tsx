import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, ArrowRight } from 'lucide-react'
import { ContentPage } from '@/components/content-page'
import { Button } from '@/components/ui/button'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/pricing')({
  head: () =>
    pageHead({
      title: 'Pricing — The everyday toolkit is free',
      description:
        'Free business document generators, calculators, PDF export and an optional workspace. No credit card required.',
      path: '/pricing',
    }),
  component: Page,
})
function Page() {
  return (
    <ContentPage
      eyebrow="SIMPLE TOOLS. SIMPLE PRICING."
      title="Free is a pretty good price."
      intro="Get the essentials done, without adding another subscription to your business."
    >
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-primary bg-card p-8">
          <span className="eyebrow text-primary">THE EVERYDAY TOOLKIT</span>
          <h2 className="mt-4 font-display text-5xl font-semibold">
            $0
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              always for basic tools
            </span>
          </h2>
          <ul className="my-8 space-y-4 text-sm">
            {[
              'All 6 business calculators',
              'Invoice, quotation and receipt generators',
              'Unlimited browser print / PDF export',
              'Your logo, colors and currency',
              'Free document templates',
              'Optional account and saved business profile',
              'Up to 100 saved documents per account',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Check size={17} className="shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
          <Button asChild className="w-full">
            <Link to="/tools">
              Start creating <ArrowRight />
            </Link>
          </Button>
        </section>
        <section className="rounded-xl border bg-secondary/40 p-8">
          <span className="eyebrow">ON THE HORIZON</span>
          <h2 className="mt-4 font-display text-3xl font-semibold">A little extra, later.</h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Premium design packs, advanced branding, and more ways to reuse your work are on the
            roadmap. There are no paid plans or checkout today.
          </p>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Our promise: your basic tools stay useful and free. Upgrades should save you time or add
            choice.
          </p>
          <Button asChild variant="outline" className="mt-8">
            <Link to="/contact">
              Tell us what you need <ArrowRight />
            </Link>
          </Button>
        </section>
      </div>
    </ContentPage>
  )
}
