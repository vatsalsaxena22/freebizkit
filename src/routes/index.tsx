import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Zap,
  Download,
  Sparkles,
  FileText,
  Calculator,
  CheckCheck,
} from 'lucide-react'
import { ToolDirectory } from '@/components/tool-directory'
import { Button } from '@/components/ui/button'
import { pageHead } from '@/lib/site'

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      title: 'FreeBizKit — Less busywork. More business.',
      description:
        'Free invoices, quotations, receipts and business calculators. Practical tools for independent businesses. No sign-up needed.',
      path: '/',
    }),
  component: Home,
})
function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="relative z-10">
            <span className="hero-badge">
              <span className="size-1.5 rounded-full bg-primary" />
              YOUR BUSINESS, A LITTLE LIGHTER
            </span>
            <h1 className="mt-6 font-display text-[clamp(3rem,5.3vw,4.7rem)] font-semibold leading-[1.06] tracking-[-0.055em]">
              Less busywork.
              <br />
              More{' '}
              <span className="relative text-primary">
                business.
                <svg
                  viewBox="0 0 300 13"
                  className="absolute -bottom-3 left-0 w-full text-accent"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8Q140 -2 295 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-[29rem] text-base leading-7 text-muted-foreground">
              Professional documents. Clearer numbers. All the little tools you need to run your
              business — together, and completely free.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#all-tools">
                  Explore free tools <ArrowRight size={16} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-card">
                <Link to="/tools/$slug" params={{ slug: 'invoice-generator' }}>
                  Create an invoice <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-primary" />
                No sign-up needed
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-primary" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-primary" />
                Yours to keep
              </span>
            </div>
          </div>
          <div className="hero-art" aria-label="Example professional invoice preview">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="art-spark">
              <Sparkles size={25} />
            </span>
            <div className="invoice-paper">
              <div className="flex items-start justify-between border-b pb-6">
                <div>
                  <div className="flex items-center gap-2 font-display text-base font-bold">
                    <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
                      s.
                    </span>{' '}
                    studio north
                  </div>
                  <p className="mt-2 text-[9px] text-muted-foreground">
                    Good work deserves a great invoice.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-semibold text-primary">INVOICE</p>
                  <p className="mt-1 text-[9px] text-muted-foreground">#INV-2026-042</p>
                </div>
              </div>
              <div className="my-6 flex justify-between text-[10px]">
                <div>
                  <p className="mb-2 text-[8px] uppercase tracking-widest text-muted-foreground">
                    Billed to
                  </p>
                  <strong>Olive & Oak Co.</strong>
                  <p className="mt-1 text-muted-foreground">hello@oliveandoak.example</p>
                </div>
                <div className="text-right">
                  <p className="mb-2 text-[8px] uppercase tracking-widest text-muted-foreground">
                    Issued
                  </p>
                  <p>November 03, 2026</p>
                  <p className="mt-1 text-muted-foreground">Due in 14 days</p>
                </div>
              </div>
              <div className="flex justify-between bg-secondary/70 px-3 py-2 text-[8px] font-semibold uppercase tracking-wider">
                <span>Description</span>
                <span>Amount</span>
              </div>
              {[
                ['Brand identity design', '$1,200.00'],
                ['Website consultation', '$450.00'],
              ].map(([name, price]) => (
                <div key={name} className="flex justify-between border-b px-3 py-4 text-[10px]">
                  <span>{name}</span>
                  <span>{price}</span>
                </div>
              ))}
              <div className="ml-auto mt-5 w-44 space-y-2 text-[10px]">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>$1,650.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span>$165.00</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-sm font-bold text-primary">
                  <span>Total due</span>
                  <span>$1,815.00</span>
                </div>
              </div>
              <div className="mt-7 flex items-center justify-between border-t pt-4 text-[8px] text-muted-foreground">
                <span>Thank you for your business.</span>
                <span>Made with FreeBizKit ↗</span>
              </div>
            </div>
            <div className="floating-note note-one">
              <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                <CheckCheck size={19} />
              </span>
              <div>
                <strong>Looking professional.</strong>
                <p>Without the paperwork.</p>
              </div>
            </div>
            <div className="floating-note note-two">
              <Download size={17} className="text-primary" />
              <span>Ready. Set. PDF.</span>
              <span className="rounded bg-primary/10 px-1.5 py-1 text-[9px] text-primary">
                FREE
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="border-y bg-card/60">
        <div className="mx-auto flex max-w-content flex-wrap justify-between gap-6 px-4 py-5 sm:px-6">
          <p className="self-center text-xs font-medium text-muted-foreground">
            BUILT FOR YOUR INDEPENDENT BUSINESS
          </p>
          {[
            [ShieldCheck, 'Private by design'],
            [Zap, 'Works in your browser'],
            [Download, 'Free PDF exports'],
          ].map(([Icon, label]) => {
            const I = Icon as typeof ShieldCheck
            return (
              <span key={String(label)} className="flex items-center gap-2.5 text-sm font-medium">
                <I size={18} strokeWidth={1.5} className="text-primary" />
                {String(label)}
              </span>
            )
          })}
        </div>
      </div>
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <ToolDirectory />
      </div>
      <section className="mx-auto max-w-content px-4 pb-14 sm:px-6">
        <div className="work-banner">
          <div>
            <span className="eyebrow text-primary">FROM TO-DO TO TA-DA</span>
            <h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight">
              You do the work.
              <br />
              We’ll handle the little things.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Built for the freelancers, the one-person teams, and the businesses making it happen.
            </p>
            <Link
              to="/about"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              A little about us <ArrowRight size={15} />
            </Link>
          </div>
          <div className="space-y-6">
            {[
              [
                FileText,
                'Make it yours',
                'Add your logo, choose your color, and send something you’re proud of.',
              ],
              [
                Calculator,
                'Skip the spreadsheet',
                'Get the numbers you need, with the math explained.',
              ],
              [
                ShieldCheck,
                'Your business stays yours',
                'Public tools run in your browser. Cloud saving is always your choice.',
              ],
            ].map(([Icon, title, desc]) => {
              const I = Icon as typeof FileText
              return (
                <div key={String(title)} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border bg-card">
                    <I size={19} className="text-primary" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{String(title)}</h3>
                    <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">
                      {String(desc)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto flex max-w-content flex-col justify-between gap-5 border-t px-4 pt-9 sm:px-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="tool-icon tone-1">
            <Sparkles size={22} />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold">Missing your go-to tool?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us what would make your workday easier.
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to="/contact">
            Suggest a tool <ArrowUpRight size={16} />
          </Link>
        </Button>
      </section>
    </main>
  )
}
