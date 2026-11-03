import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { GeneratorDef } from '@/generators/registry'
import type { CalculatorDef } from '@/calculators/registry'

export function ToolCard({
  tool,
  category,
  index = 0,
}: {
  tool: GeneratorDef | CalculatorDef
  category: 'tools' | 'calculators'
  index?: number
}) {
  return (
    <Link
      to={category === 'tools' ? '/tools/$slug' : '/calculators/$slug'}
      params={{ slug: tool.slug }}
      className="tool-card group"
    >
      <div className="flex items-start justify-between">
        <span className={`tool-icon tone-${index % 4}`}>
          <tool.icon size={23} strokeWidth={1.6} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {category === 'tools' ? 'Document' : 'Calculator'}
        </span>
      </div>
      <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{tool.blurb}</p>
      <div className="mt-7 flex items-center justify-between">
        <span className="text-xs font-medium text-primary">Free to use</span>
        <ArrowUpRight
          size={18}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        />
      </div>
    </Link>
  )
}
