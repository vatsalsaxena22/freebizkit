import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ContentPage } from '@/components/content-page'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/about')({
  head: () =>
    pageHead({
      title: 'About FreeBizKit',
      description:
        'A lighter way to run an independent business. Why we build useful, free business tools.',
      path: '/about',
    }),
  component: Page,
})
function Page() {
  return (
    <ContentPage
      eyebrow="THE STORY BEHIND THE TOOLKIT"
      title="For people doing their own thing."
      intro="Running a small business comes with a surprisingly large amount of small tasks. We’re here to make those tasks smaller."
    >
      <div className="max-w-reading space-y-8 leading-7">
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Useful from the first click</h2>
          <p className="text-muted-foreground">
            An invoice shouldn’t take an afternoon. A pricing calculation shouldn’t need a
            spreadsheet. FreeBizKit brings everyday document tools and business math together in one
            simple place. Open a tool, do the work, and take the result with you.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Your work, your choice</h2>
          <p className="text-muted-foreground">
            Our generators and calculators run directly in your browser. You can export a document
            without creating an account. If you choose to save work to an account, we store editable
            document data and your reusable business profile, so you can pick up where you left off.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold">Small by design</h2>
          <p className="text-muted-foreground">
            We build focused tools for freelancers, consultants, creators and small businesses. The
            core toolkit is free. Future paid features may add convenience and design options, while
            basic generation, calculation and export remain free.
          </p>
        </section>
        <Link to="/tools" className="inline-flex items-center gap-2 font-semibold text-primary">
          Find your first tool <ArrowRight size={17} />
        </Link>
      </div>
    </ContentPage>
  )
}
