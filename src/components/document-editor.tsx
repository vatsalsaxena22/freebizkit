import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Download, ImagePlus, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { DocumentData, LineItem, Party } from '@/generators/document'
import { computeTotals, lineAmount, newItem } from '@/generators/document'
import type { GeneratorDef } from '@/generators/registry'
import { ACCENT_PRESETS, sampleDocument } from '@/data/fixtures'
import { CURRENCIES, formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'
import { DocumentPreview } from '@/components/document-preview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const MAX_LOGO_BYTES = 300 * 1024
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

const draftKey = (kind: string) => `fbk:draft:${kind}`
const logoKey = 'fbk:logo'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({
  id,
  label,
  className,
  children,
}: {
  id: string
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}

function PartyFields({
  prefix,
  party,
  onChange,
  nameLabel,
}: {
  prefix: string
  party: Party
  onChange: (p: Party) => void
  nameLabel: string
}) {
  const set = (k: keyof Party) => (e: { target: { value: string } }) =>
    onChange({ ...party, [k]: e.target.value })
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id={`${prefix}-name`} label={nameLabel} className="sm:col-span-2">
        <Input id={`${prefix}-name`} value={party.name} onChange={set('name')} />
      </Field>
      <Field id={`${prefix}-email`} label="Email">
        <Input id={`${prefix}-email`} type="email" value={party.email} onChange={set('email')} />
      </Field>
      <Field id={`${prefix}-phone`} label="Phone">
        <Input id={`${prefix}-phone`} value={party.phone} onChange={set('phone')} />
      </Field>
      <Field id={`${prefix}-address`} label="Address" className="sm:col-span-2">
        <Textarea id={`${prefix}-address`} rows={2} value={party.address} onChange={set('address')} />
      </Field>
      <Field id={`${prefix}-tax`} label="Tax ID / GSTIN (optional)" className="sm:col-span-2">
        <Input id={`${prefix}-tax`} value={party.taxId} onChange={set('taxId')} />
      </Field>
    </div>
  )
}

export function DocumentEditor({ gen }: { gen: GeneratorDef }) {
  // Dates start empty so server and client markup match; the effect below
  // fills them from the saved draft or today's date after hydration.
  const [doc, setDoc] = useState<DocumentData>(() => ({
    ...sampleDocument(gen.kind),
    issueDate: '',
    secondaryDate: '',
  }))
  const [logo, setLogo] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey(gen.kind))
      setDoc(saved ? { ...sampleDocument(gen.kind), ...JSON.parse(saved) } : sampleDocument(gen.kind))
      setLogo(localStorage.getItem(logoKey))
    } catch {
      setDoc(sampleDocument(gen.kind))
    }
    setLoaded(true)
  }, [gen.kind])

  useEffect(() => {
    if (!loaded) return
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(gen.kind), JSON.stringify(doc))
      } catch {
        /* storage full or disabled — drafts are a convenience only */
      }
    }, 400)
    return () => clearTimeout(t)
  }, [doc, loaded, gen.kind])

  const update = <K extends keyof DocumentData>(key: K, value: DocumentData[K]) =>
    setDoc((d) => ({ ...d, [key]: value }))

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setDoc((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }))

  const onLogo = (file: File | undefined) => {
    if (!file) return
    if (!LOGO_TYPES.includes(file.type)) {
      toast.error('Please use a PNG, JPG, WebP or SVG image')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error('Logo must be under 300 KB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result)
      setLogo(url)
      try {
        localStorage.setItem(logoKey, url)
      } catch {
        /* ignore */
      }
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogo(null)
    try {
      localStorage.removeItem(logoKey)
    } catch {
      /* ignore */
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const totals = computeTotals(doc)

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="space-y-5 print:hidden">
        <Section title="Your business">
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed bg-muted">
              {logo ? (
                <img src={logo} alt="Your logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept={LOGO_TYPES.join(',')}
                className="sr-only"
                id="logo-input"
                onChange={(e) => onLogo(e.target.files?.[0])}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                {logo ? 'Change logo' : 'Add logo'}
              </Button>
              {logo && (
                <Button type="button" variant="ghost" size="sm" onClick={removeLogo}>
                  <X /> Remove
                </Button>
              )}
              <p className="w-full text-xs text-muted-foreground">PNG, JPG, WebP or SVG · up to 300 KB · stays on this device</p>
            </div>
          </div>
          <PartyFields prefix="from" party={doc.from} onChange={(p) => update('from', p)} nameLabel="Business name" />
        </Section>

        <Section title={gen.kind === 'receipt' ? 'Received from' : gen.kind === 'quotation' ? 'Prepared for' : 'Bill to'}>
          <PartyFields prefix="to" party={doc.to} onChange={(p) => update('to', p)} nameLabel="Client name" />
        </Section>

        <Section title={`${gen.docTitle} details`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="doc-number" label={`${gen.docTitle} number`}>
              <Input id="doc-number" className="tabular" value={doc.number} onChange={(e) => update('number', e.target.value)} />
            </Field>
            <Field id="doc-currency" label="Currency">
              <Select value={doc.currency} onValueChange={(v) => update('currency', v)}>
                <SelectTrigger id="doc-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field id="doc-date" label={gen.kind === 'receipt' ? 'Payment date' : 'Issue date'}>
              <Input id="doc-date" type="date" value={doc.issueDate} onChange={(e) => update('issueDate', e.target.value)} />
            </Field>
            {gen.secondaryDateLabel ? (
              <Field id="doc-date2" label={gen.secondaryDateLabel}>
                <Input id="doc-date2" type="date" value={doc.secondaryDate} onChange={(e) => update('secondaryDate', e.target.value)} />
              </Field>
            ) : (
              <Field id="doc-method" label="Payment method">
                <Input id="doc-method" value={doc.paymentMethod} onChange={(e) => update('paymentMethod', e.target.value)} />
              </Field>
            )}
          </div>
        </Section>

        <Section title="Line items">
          <div className="hidden grid-cols-[1fr_4.5rem_6.5rem_6.5rem_2.25rem] gap-2 text-xs font-medium text-muted-foreground sm:grid">
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amount</span>
            <span />
          </div>
          <ul className="space-y-3">
            {doc.items.map((item, i) => (
              <li
                key={item.id}
                className="grid grid-cols-[1fr_1fr_2.25rem] gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_4.5rem_6.5rem_6.5rem_2.25rem] sm:items-center sm:border-0 sm:p-0"
              >
                <Input
                  aria-label={`Item ${i + 1} description`}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, { description: e.target.value })}
                  className="col-span-3 sm:col-span-1"
                />
                <Input
                  aria-label={`Item ${i + 1} quantity`}
                  inputMode="decimal"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                  className="tabular text-right"
                />
                <Input
                  aria-label={`Item ${i + 1} rate`}
                  inputMode="decimal"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, { rate: e.target.value })}
                  className="tabular text-right"
                />
                <span className="tabular hidden text-right text-sm sm:block">
                  {formatMoney(lineAmount(item), doc.currency)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove item ${i + 1}`}
                  onClick={() => update('items', doc.items.filter((it) => it.id !== item.id))}
                  className="row-start-2 col-start-3 sm:row-auto sm:col-auto"
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
          <Button type="button" variant="outline" size="sm" onClick={() => update('items', [...doc.items, newItem()])}>
            <Plus /> Add item
          </Button>
        </Section>

        <Section title="Tax & discount">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="tax-label" label="Tax name">
              <Input id="tax-label" placeholder="Tax, GST, VAT…" value={doc.taxLabel} onChange={(e) => update('taxLabel', e.target.value)} />
            </Field>
            <Field id="tax-rate" label="Tax rate (%)">
              <Input id="tax-rate" inputMode="decimal" className="tabular" value={doc.taxRate} onChange={(e) => update('taxRate', e.target.value)} />
            </Field>
            <Field id="discount-type" label="Discount type">
              <Select value={doc.discountType} onValueChange={(v) => update('discountType', v as DocumentData['discountType'])}>
                <SelectTrigger id="discount-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field id="discount-value" label="Discount">
              <Input id="discount-value" inputMode="decimal" className="tabular" value={doc.discountValue} onChange={(e) => update('discountValue', e.target.value)} />
            </Field>
          </div>
          <dl className="tabular grid grid-cols-2 gap-y-1 rounded-lg bg-muted px-4 py-3 text-sm">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-right">{formatMoney(totals.subtotal, doc.currency)}</dd>
            <dt className="text-muted-foreground">Discount</dt>
            <dd className="text-right">−{formatMoney(totals.discount, doc.currency)}</dd>
            <dt className="text-muted-foreground">{doc.taxLabel || 'Tax'}</dt>
            <dd className="text-right">{formatMoney(totals.tax, doc.currency)}</dd>
            <dt className="font-semibold">Total</dt>
            <dd className="text-right font-semibold">{formatMoney(totals.total, doc.currency)}</dd>
          </dl>
        </Section>

        <Section title="Notes & terms">
          <Field id="notes" label="Notes">
            <Textarea id="notes" rows={2} value={doc.notes} onChange={(e) => update('notes', e.target.value)} />
          </Field>
          <Field id="terms" label={gen.kind === 'invoice' ? 'Payment terms' : 'Terms'}>
            <Textarea id="terms" rows={2} value={doc.terms} onChange={(e) => update('terms', e.target.value)} />
          </Field>
        </Section>

        <Section title="Style">
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Accent colour</legend>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  aria-label={p.name}
                  aria-pressed={doc.accent === p.value}
                  onClick={() => update('accent', p.value)}
                  className={cn(
                    'size-8 rounded-full border-2 border-card ring-2 ring-transparent transition-shadow motion-reduce:transition-none',
                    doc.accent === p.value && 'ring-foreground',
                  )}
                  style={{ background: p.value }}
                />
              ))}
              <label className="ml-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="color"
                  value={doc.accent}
                  onChange={(e) => update('accent', e.target.value)}
                  className="size-8 cursor-pointer rounded-md border bg-transparent"
                />
                Custom
              </label>
            </div>
          </fieldset>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="branding" className="font-normal">
              Show “Created with FreeBizKit” footer
            </Label>
            <Switch id="branding" checked={doc.showBranding} onCheckedChange={(v) => update('showBranding', v)} />
          </div>
        </Section>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <p className="text-xs text-muted-foreground">
            {loaded ? 'Draft auto-saved in this browser' : 'Loading draft…'}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setDoc(sampleDocument(gen.kind))
                toast('Reset to the sample ' + gen.docTitle.toLowerCase())
              }}
            >
              <RotateCcw /> Reset
            </Button>
            <Button type="button" size="sm" onClick={() => window.print()}>
              <Download /> Download PDF
            </Button>
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-3 sm:p-6 print:bg-transparent print:p-0">
          <DocumentPreview doc={doc} logo={logo} />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground print:hidden">
          Tip: in the print dialog choose <strong>Save as PDF</strong> as the destination.
        </p>
      </div>
    </div>
  )
}
