import { createFileRoute } from '@tanstack/react-router'
import { Check, ArrowUpRight } from 'lucide-react'
import { ContentPage } from '@/components/content-page'
import { DocumentPreview } from '@/components/document-preview'
import { sampleDocument } from '@/data/fixtures'
import { Button } from '@/components/ui/button'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/templates')({
  head: () =>
    pageHead({
      title: 'Free business document templates',
      description:
        'Start with a free professional invoice, quotation or receipt template. Customize your logo and color and export a PDF.',
      path: '/templates',
    }),
  component: Page,
})
function Page() {
  return (
    <ContentPage
      eyebrow="A GOOD PLACE TO START"
      title="Your work. Well presented."
      intro="Three clean, practical templates. Choose a starting point, add your details, and make it yours."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {(
          [
            {
              kind: 'invoice',
              name: 'The everyday invoice',
              color: '#1f7a5a',
              description: 'A clear, confident invoice for a job well done.',
            },
            {
              kind: 'quotation',
              name: 'The thoughtful quotation',
              color: '#24407a',
              description: 'Itemized pricing that makes your next project official.',
            },
            {
              kind: 'receipt',
              name: 'The tidy receipt',
              color: '#b4532a',
              description: 'A proper record of a payment received.',
            },
          ] as const
        ).map((t) => (
          <section key={t.kind} className="overflow-hidden rounded-xl border bg-card">
            <div className="h-80 overflow-hidden bg-secondary p-7" aria-hidden="true">
              <div className="pointer-events-none origin-top scale-[.8] w-[125%]">
                <DocumentPreview
                  doc={{
                    ...sampleDocument(t.kind),
                    issueDate: '2026-11-03',
                    secondaryDate: '2026-11-17',
                    accent: t.color,
                  }}
                  logo={null}
                />
              </div>
            </div>
            <div className="p-6">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                <Check size={12} />
                Free template
              </span>
              <h2 className="mt-3 font-display text-xl font-semibold">{t.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.description}</p>
              <Button asChild variant="outline" className="mt-5 w-full">
                <a href={`/tools/${t.kind}-generator?accent=${encodeURIComponent(t.color)}`}>
                  Use this template <ArrowUpRight size={16} />
                </a>
              </Button>
            </div>
          </section>
        ))}
      </div>
    </ContentPage>
  )
}
