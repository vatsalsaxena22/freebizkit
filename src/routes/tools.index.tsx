import { createFileRoute } from '@tanstack/react-router'
import { ToolDirectory } from '@/components/tool-directory'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/tools/')({
  head: () =>
    pageHead({
      title: 'Document tools',
      description:
        'Create professional invoices, quotations and payment receipts. Add your details, preview live, and save a PDF — all for free.',
      path: '/tools',
    }),
  component: Page,
})
function Page() {
  return (
    <main className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <p className="eyebrow">FREEBIZKIT / TOOLS</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Documents that mean business.
      </h1>
      <p className="mt-5 mb-14 max-w-2xl leading-7 text-muted-foreground">
        Create professional invoices, quotations and payment receipts. Add your details, preview
        live, and save a PDF — all for free.
      </p>
      <ToolDirectory initial="tools" compact />
    </main>
  )
}
