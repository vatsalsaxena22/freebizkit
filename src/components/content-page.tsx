import type { ReactNode } from 'react'
export function ContentPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}) {
  return (
    <main className="mx-auto max-w-content px-4 py-14 sm:px-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 mb-10 max-w-2xl text-base leading-7 text-muted-foreground">{intro}</p>
      {children}
    </main>
  )
}
