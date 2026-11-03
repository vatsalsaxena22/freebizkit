import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const nav = [
  { to: '/tools', label: 'Document tools' },
  { to: '/calculators', label: 'Calculators' },
  { to: '/templates', label: 'Templates' },
  { to: '/pricing', label: 'Pricing' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="FreeBizKit home" className="rounded-md">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none"
              activeProps={{ className: 'text-foreground' }}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/dashboard" className="ml-3 px-3 text-sm font-medium">
            My workspace
          </Link>
          <Button asChild size="sm" className="ml-1">
            <Link to="/tools/$slug" params={{ slug: 'invoice-generator' }}>
              Create an invoice
            </Link>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Free tools for freelancers and small businesses.</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
              {nav.map((item) => (
                <SheetClose asChild key={item.to}>
                  <Link to={item.to} className="rounded-md px-3 py-3 font-medium hover:bg-muted">
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link to="/dashboard" className="rounded-md px-3 py-3 font-medium hover:bg-muted">
                  My workspace
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="mt-4">
                  <Link to="/tools/$slug" params={{ slug: 'invoice-generator' }}>
                    Create an invoice
                  </Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
