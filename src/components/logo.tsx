import { cn } from '@/lib/utils'

/** FreeBizKit mark: a folded document corner with a ledger tick. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-8', className)}>
      <rect x="3" y="2" width="22" height="28" rx="3" className="fill-primary" />
      <path d="M19 2h3a3 3 0 0 1 3 3v3h-6z" className="fill-accent" />
      <path
        d="M8 12h12M8 17h8"
        className="stroke-primary-foreground"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="m15 23 3 3 8-8"
        fill="none"
        className="stroke-accent"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight">
        Free<span className="text-primary">Biz</span>Kit
      </span>
    </span>
  )
}
