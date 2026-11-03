import { Link } from '@tanstack/react-router'
import { Logo } from '@/components/logo'
import { calculators } from '@/calculators/registry'
import { generators } from '@/generators/registry'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-secondary/60 print:hidden">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Practical, free business tools that run in your browser. No sign-up needed. Create and
            calculate in your browser, with optional cloud saving.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Document tools</h2>
          <ul className="space-y-2 text-sm">
            {generators.map((g) => (
              <li key={g.slug}>
                <Link
                  to="/tools/$slug"
                  params={{ slug: g.slug }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Calculators</h2>
          <ul className="space-y-2 text-sm">
            {calculators.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/calculators/$slug"
                  params={{ slug: c.slug }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <nav
          aria-label="Company and legal"
          className="mx-auto flex max-w-content flex-wrap gap-5 px-4 pt-5 text-xs text-muted-foreground sm:px-6"
        >
          {(
            [
              { to: '/about', label: 'About' },
              { to: '/pricing', label: 'Pricing' },
              { to: '/contact', label: 'Contact & feedback' },
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
            ] as const
          ).map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mx-auto max-w-content px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} FreeBizKit. Results are estimates for planning — check tax
          figures with your accountant.
        </p>
      </div>
    </footer>
  )
}
