import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { generators } from '@/generators/registry'
import { calculators } from '@/calculators/registry'
import { ToolCard } from '@/components/tool-card'
import { Input } from '@/components/ui/input'

export function ToolDirectory({
  initial = 'all',
  compact = false,
}: {
  initial?: 'all' | 'tools' | 'calculators'
  compact?: boolean
}) {
  const [category, setCategory] = useState(initial)
  const [query, setQuery] = useState('')
  const all = [
    ...generators.map((tool) => ({ tool, category: 'tools' as const })),
    ...calculators.map((tool) => ({ tool, category: 'calculators' as const })),
  ]
  const items = all.filter(
    (item) =>
      (category === 'all' || category === item.category) &&
      `${item.tool.name} ${item.tool.blurb}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <section id="all-tools" className="scroll-mt-24">
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">A LITTLE LESS ADMIN. A LOT MORE DONE.</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {compact ? 'Find your next shortcut' : 'Your everyday toolkit'}
          </h2>
        </div>
        <span className="text-sm text-muted-foreground">Small tools. Big time-savers.</span>
      </div>
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-wrap gap-2" aria-label="Filter tools">
          {(
            [
              ['all', 'All tools', 9],
              ['tools', 'Documents', 3],
              ['calculators', 'Calculators', 6],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              aria-pressed={category === key}
              className={`filter-pill ${category === key ? 'selected' : ''}`}
            >
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
          <Input
            aria-label="Search tools"
            placeholder="Find a tool…"
            className="h-10 bg-card pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ tool, category }, i) => (
          <ToolCard key={tool.slug} tool={tool} category={category} index={i} />
        ))}
      </div>
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed p-14 text-center">
          <SlidersHorizontal className="mx-auto mb-4 text-primary" />
          <h3 className="font-semibold">No tools found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader search or a different category.
          </p>
          <button
            onClick={() => {
              setQuery('')
              setCategory('all')
            }}
            className="mt-4 text-sm font-medium text-primary underline"
          >
            Show all tools
          </button>
        </div>
      )}
    </section>
  )
}
