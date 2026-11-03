import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Download, ImagePlus, Plus, RotateCcw, Trash2, X, Save, CloudUpload } from 'lucide-react'
import { toast } from 'sonner'
import { getUser } from '@netlify/identity'
import { workspaceRequest } from '@/lib/workspace'
import { documentSchema } from '@/lib/document-schema'
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
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']

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
        <Textarea
          id={`${prefix}-address`}
          rows={2}
          value={party.address}
          onChange={set('address')}
        />
      </Field>
      <Field id={`${prefix}-tax`} label="Tax ID / GSTIN (optional)" className="sm:col-span-2">
        <Input id={`${prefix}-tax`} value={party.taxId} onChange={set('taxId')} />
      </Field>
    </div>
  )
}

export function DocumentEditor({ gen }: { gen: GeneratorDef }) {
  // Fill dates and optional cloud data after hydration.
  const [doc, setDoc] = useState<DocumentData>(() => ({
    ...sampleDocument(gen.kind),
    issueDate: '',
    secondaryDate: '',
  }))
  const [logo, setLogo] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [documentId, setDocumentId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [signedIn, setSignedIn] = useState(false)
  const [logoBusy, setLogoBusy] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      const params = new URLSearchParams(window.location.search)
      const accent = params.get('accent')
      const initial = sampleDocument(gen.kind)
      if (accent && /^#[0-9a-fA-F]{6}$/.test(accent)) initial.accent = accent
      setDoc(initial)
      try {
        const user = await getUser()
        if (!active) return
        setSignedIn(Boolean(user))
        const id = params.get('document')
        if (id && !user)
          throw new Error('Sign in from My workspace, then open this document again.')
        if (user) {
          if (id) {
            const result = await workspaceRequest<{
              id: string
              data: DocumentData
            }>('GET', undefined, id)
            const parsed = documentSchema.parse(result.data)
            if (parsed.kind !== gen.kind)
              throw new Error('This document belongs to a different generator.')
            if (active) {
              setDoc(parsed)
              setDocumentId(result.id)
            }
          } else {
            const result = await workspaceRequest<{
              profile: { from: Party; accent: string; currency: string } | null
            }>()
            if (result.profile && active)
              setDoc({
                ...initial,
                ...result.profile,
                accent: accent && /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : result.profile.accent,
              })
          }
          const res = await fetch('/api/logo')
          if (res.ok && active) setLogo(URL.createObjectURL(await res.blob()))
        }
      } catch (error) {
        if (active && new URLSearchParams(window.location.search).has('document'))
          setLoadError(
            error instanceof Error ? error.message : 'Couldn’t load your saved document.',
          )
        else if (active)
          toast.error(
            'Your saved profile is unavailable. You can still edit and export this document.',
          )
      } finally {
        if (active) setLoaded(true)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [gen.kind])

  useEffect(
    () => () => {
      if (logo?.startsWith('blob:')) URL.revokeObjectURL(logo)
    },
    [logo],
  )

  const save = async () => {
    if (!signedIn) {
      toast('Sign in from My workspace to save documents. Export is always free.')
      return
    }
    setSaving(true)
    try {
      const parsed = documentSchema.safeParse(doc)
      if (!parsed.success)
        throw new Error(parsed.error.issues[0]?.message ?? 'Check your document fields.')
      const result = await workspaceRequest<{ id: string }>('POST', {
        id: documentId,
        data: parsed.data,
      })
      setDocumentId(result.id)
      const url = new URL(window.location.href)
      url.searchParams.set('document', result.id)
      window.history.replaceState(null, '', url)
      toast.success('Document saved to your workspace')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Couldn’t save document')
    } finally {
      setSaving(false)
    }
  }

  const saveLogo = async () => {
    if (!logo) return
    setLogoBusy(true)
    try {
      const blob = await (await fetch(logo)).blob()
      const res = await fetch('/api/logo', {
        method: 'POST',
        headers: { 'Content-Type': blob.type },
        body: blob,
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Logo saved to your account')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Couldn’t save logo')
    } finally {
      setLogoBusy(false)
    }
  }

  const update = <K extends keyof DocumentData>(key: K, value: DocumentData[K]) =>
    setDoc((d) => ({ ...d, [key]: value }))

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setDoc((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }))

  const onLogo = (file: File | undefined) => {
    if (!file) return
    if (!LOGO_TYPES.includes(file.type)) {
      toast.error('Please use a PNG, JPG or WebP image')
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
    }
    reader.readAsDataURL(file)
  }

  const removeLogo = () => {
    setLogo(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const totals = computeTotals(doc)

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] print:contents">
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                {logo ? 'Change logo' : 'Add logo'}
              </Button>
              {logo && (
                <Button type="button" variant="ghost" size="sm" onClick={removeLogo}>
                  <X /> Remove
                </Button>
              )}
              {signedIn && logo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={logoBusy}
                  onClick={saveLogo}
                >
                  <CloudUpload />
                  {logoBusy ? 'Saving…' : 'Save logo to account'}
                </Button>
              )}
              {signedIn && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={logoBusy}
                  onClick={async () => {
                    setLogoBusy(true)
                    try {
                      const res = await fetch('/api/logo', {
                        method: 'DELETE',
                      })
                      if (!res.ok) throw new Error()
                      removeLogo()
                      toast.success('Cloud logo removed')
                    } catch {
                      toast.error('Couldn’t delete cloud logo')
                    } finally {
                      setLogoBusy(false)
                    }
                  }}
                >
                  Delete cloud logo
                </Button>
              )}
              <p className="w-full text-xs text-muted-foreground">
                PNG, JPG or WebP · up to 300 KB · uploaded only when you choose Save logo
              </p>
            </div>
          </div>
          <PartyFields
            prefix="from"
            party={doc.from}
            onChange={(p) => update('from', p)}
            nameLabel="Business name"
          />
        </Section>

        <Section
          title={
            gen.kind === 'receipt'
              ? 'Received from'
              : gen.kind === 'quotation'
                ? 'Prepared for'
                : 'Bill to'
          }
        >
          <PartyFields
            prefix="to"
            party={doc.to}
            onChange={(p) => update('to', p)}
            nameLabel="Client name"
          />
        </Section>

        <Section title={`${gen.docTitle} details`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="doc-number" label={`${gen.docTitle} number`}>
              <Input
                id="doc-number"
                className="tabular"
                value={doc.number}
                onChange={(e) => update('number', e.target.value)}
              />
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
              <Input
                id="doc-date"
                type="date"
                value={doc.issueDate}
                onChange={(e) => update('issueDate', e.target.value)}
              />
            </Field>
            {gen.secondaryDateLabel ? (
              <Field id="doc-date2" label={gen.secondaryDateLabel}>
                <Input
                  id="doc-date2"
                  type="date"
                  value={doc.secondaryDate}
                  onChange={(e) => update('secondaryDate', e.target.value)}
                />
              </Field>
            ) : (
              <Field id="doc-method" label="Payment method">
                <Input
                  id="doc-method"
                  value={doc.paymentMethod}
                  onChange={(e) => update('paymentMethod', e.target.value)}
                />
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
                  onClick={() =>
                    update(
                      'items',
                      doc.items.filter((it) => it.id !== item.id),
                    )
                  }
                  className="row-start-2 col-start-3 sm:row-auto sm:col-auto"
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => update('items', [...doc.items, newItem()])}
          >
            <Plus /> Add item
          </Button>
        </Section>

        <Section title="Tax & discount">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="tax-label" label="Tax name">
              <Input
                id="tax-label"
                placeholder="Tax, GST, VAT…"
                value={doc.taxLabel}
                onChange={(e) => update('taxLabel', e.target.value)}
              />
            </Field>
            <Field id="tax-rate" label="Tax rate (%)">
              <Input
                id="tax-rate"
                inputMode="decimal"
                className="tabular"
                value={doc.taxRate}
                onChange={(e) => update('taxRate', e.target.value)}
              />
            </Field>
            <Field id="discount-type" label="Discount type">
              <Select
                value={doc.discountType}
                onValueChange={(v) => update('discountType', v as DocumentData['discountType'])}
              >
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
              <Input
                id="discount-value"
                inputMode="decimal"
                className="tabular"
                value={doc.discountValue}
                onChange={(e) => update('discountValue', e.target.value)}
              />
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
            <Textarea
              id="notes"
              rows={2}
              value={doc.notes}
              onChange={(e) => update('notes', e.target.value)}
            />
          </Field>
          <Field id="terms" label={gen.kind === 'invoice' ? 'Payment terms' : 'Terms'}>
            <Textarea
              id="terms"
              rows={2}
              value={doc.terms}
              onChange={(e) => update('terms', e.target.value)}
            />
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
            <Switch
              id="branding"
              checked={doc.showBranding}
              onCheckedChange={(v) => update('showBranding', v)}
            />
          </div>
        </Section>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start print:contents">
        {loadError && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-destructive/30 p-4 text-sm text-destructive print:hidden"
          >
            {loadError}
          </p>
        )}
        <div className="mb-3 print:hidden">
          <Button
            variant="outline"
            size="sm"
            disabled={!loaded || saving || Boolean(loadError)}
            onClick={save}
          >
            <Save />
            {saving ? 'Saving…' : 'Save to workspace'}
          </Button>
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <p className="text-xs text-muted-foreground">
            {loaded
              ? 'Unsaved edits stay in this tab. Save or export before leaving.'
              : 'Preparing document…'}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!window.confirm('Replace current edits with the sample document?')) return
                setDoc(sampleDocument(gen.kind))
                setDocumentId(null)
                setLoadError('')
                window.history.replaceState(null, '', window.location.pathname)
                toast('Reset to the sample ' + gen.docTitle.toLowerCase())
              }}
            >
              <RotateCcw /> Reset
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!loaded || Boolean(loadError)}
              onClick={() => {
                const parsed = documentSchema.safeParse(doc)
                if (!parsed.success) {
                  toast.error(parsed.error.issues[0]?.message ?? 'Check your document values')
                  return
                }
                window.print()
              }}
            >
              <Download /> Download PDF
            </Button>
          </div>
        </div>
        <div className="rounded-xl bg-secondary p-3 sm:p-6 print:contents print:bg-transparent print:p-0">
          <DocumentPreview doc={doc} logo={logo} />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground print:hidden">
          Tip: in the print dialog choose <strong>Save as PDF</strong> as the destination.
        </p>
      </div>
    </div>
  )
}
