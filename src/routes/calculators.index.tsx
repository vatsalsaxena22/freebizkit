import { createFileRoute } from '@tanstack/react-router'
import { ToolDirectory } from '@/components/tool-directory'
import { pageHead } from '@/lib/site'
export const Route = createFileRoute('/calculators/')({
  head: () =>
    pageHead({
      title: 'Business calculators',
      description:
        'Taxes, pricing and profitability, without the spreadsheet. Free calculators with clear formulas and instant results.',
      path: '/calculators',
    }),
  component: Page,
})
function Page() {
  return (
    <main className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <p className="eyebrow">FREEBIZKIT / CALCULATORS</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        A little clarity for your numbers.
      </h1>
      <p className="mt-5 mb-14 max-w-2xl leading-7 text-muted-foreground">
        Taxes, pricing and profitability, without the spreadsheet. Free calculators with clear
        formulas and instant results.
      </p>
      <ToolDirectory initial="calculators" compact />
    </main>
  )
}
