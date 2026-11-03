import type { DocumentData } from '@/generators/document'
import { computeTotals, lineAmount } from '@/generators/document'
import { formatMoney, formatNumber } from '@/lib/format'

function readableDate(iso: string) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

const titles = { invoice: 'Invoice', quotation: 'Quotation', receipt: 'Receipt' } as const
const secondaryLabels = { invoice: 'Due date', quotation: 'Valid until', receipt: '' } as const
const partyLabels = { invoice: 'Bill to', quotation: 'Prepared for', receipt: 'Received from' } as const
const totalLabels = { invoice: 'Amount due', quotation: 'Quoted total', receipt: 'Amount paid' } as const

export function DocumentPreview({ doc, logo }: { doc: DocumentData; logo: string | null }) {
  const t = computeTotals(doc)
  const c = doc.currency
  const items = doc.items.filter((i) => i.description.trim() || Number(i.rate))

  return (
    <article
      className="print-area relative mx-auto flex aspect-[1/1.414] w-full flex-col rounded-sm bg-white text-[11px] leading-relaxed text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_40px_-12px_rgba(30,40,60,0.25)] print:aspect-auto print:text-[12px] sm:text-[12px]"
      style={{ ['--doc-accent' as string]: doc.accent }}
      aria-label={`${titles[doc.kind]} preview`}
    >
      <div className="h-2 w-full" style={{ background: 'var(--doc-accent)' }} />
      <div className="flex flex-1 flex-col p-[6%]">
        <header className="flex items-start justify-between gap-6">
          <div className="min-w-0 space-y-1">
            {logo ? (
              <img src={logo} alt="" className="mb-2 max-h-14 max-w-[160px] object-contain" />
            ) : null}
            <p className="text-[1.25em] font-semibold text-neutral-900">{doc.from.name || 'Your business'}</p>
            <p className="whitespace-pre-line text-neutral-500">{doc.from.address}</p>
            <p className="text-neutral-500">
              {[doc.from.email, doc.from.phone].filter(Boolean).join(' · ')}
            </p>
            {doc.from.taxId && <p className="text-neutral-500">Tax ID: {doc.from.taxId}</p>}
          </div>
          <div className="shrink-0 text-right">
            <p
              className="text-[2.4em] font-bold uppercase leading-none tracking-tight"
              style={{ color: 'var(--doc-accent)' }}
            >
              {titles[doc.kind]}
            </p>
            <dl className="mt-3 space-y-0.5 text-neutral-600">
              <div className="flex justify-end gap-3">
                <dt>No.</dt>
                <dd className="tabular font-medium text-neutral-900">{doc.number || '—'}</dd>
              </div>
              <div className="flex justify-end gap-3">
                <dt>Date</dt>
                <dd className="tabular">{readableDate(doc.issueDate)}</dd>
              </div>
              {doc.kind !== 'receipt' && (
                <div className="flex justify-end gap-3">
                  <dt>{secondaryLabels[doc.kind]}</dt>
                  <dd className="tabular">{readableDate(doc.secondaryDate)}</dd>
                </div>
              )}
              {doc.kind === 'receipt' && doc.paymentMethod && (
                <div className="flex justify-end gap-3">
                  <dt>Paid via</dt>
                  <dd>{doc.paymentMethod}</dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        <section className="mt-[6%]">
          <p className="text-[0.85em] font-semibold uppercase tracking-wider" style={{ color: 'var(--doc-accent)' }}>
            {partyLabels[doc.kind]}
          </p>
          <p className="mt-1 font-semibold text-neutral-900">{doc.to.name || 'Client name'}</p>
          <p className="whitespace-pre-line text-neutral-500">{doc.to.address}</p>
          <p className="text-neutral-500">{[doc.to.email, doc.to.phone].filter(Boolean).join(' · ')}</p>
          {doc.to.taxId && <p className="text-neutral-500">Tax ID: {doc.to.taxId}</p>}
        </section>

        <table className="mt-[5%] w-full border-collapse">
          <thead>
            <tr className="border-b-2 text-left text-[0.85em] uppercase tracking-wider text-neutral-500" style={{ borderColor: 'var(--doc-accent)' }}>
              <th className="py-2 pr-2 font-semibold">Description</th>
              <th className="w-[12%] py-2 text-right font-semibold">Qty</th>
              <th className="w-[20%] py-2 text-right font-semibold">Rate</th>
              <th className="w-[22%] py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-neutral-400">
                  Add a line item to get started
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-neutral-200 align-top">
                  <td className="py-2 pr-2 text-neutral-900">{item.description || '—'}</td>
                  <td className="tabular py-2 text-right">{formatNumber(Number(item.quantity) || 0)}</td>
                  <td className="tabular py-2 text-right">{formatMoney(Number(item.rate) || 0, c)}</td>
                  <td className="tabular py-2 text-right text-neutral-900">{formatMoney(lineAmount(item), c)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <dl className="w-[52%] space-y-1">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Subtotal</dt>
              <dd className="tabular">{formatMoney(t.subtotal, c)}</dd>
            </div>
            {t.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-neutral-500">
                  Discount{doc.discountType === 'percent' ? ` (${doc.discountValue}%)` : ''}
                </dt>
                <dd className="tabular">−{formatMoney(t.discount, c)}</dd>
              </div>
            )}
            {Number(doc.taxRate) > 0 && (
              <div className="flex justify-between">
                <dt className="text-neutral-500">
                  {doc.taxLabel || 'Tax'} ({doc.taxRate}%)
                </dt>
                <dd className="tabular">{formatMoney(t.tax, c)}</dd>
              </div>
            )}
            <div
              className="mt-2 flex justify-between rounded-sm px-3 py-2 text-[1.15em] font-semibold text-white"
              style={{ background: 'var(--doc-accent)' }}
            >
              <dt>{totalLabels[doc.kind]}</dt>
              <dd className="tabular">{formatMoney(t.total, c)}</dd>
            </div>
          </dl>
        </div>

        {doc.kind === 'receipt' && (
          <div
            className="pointer-events-none absolute top-[38%] right-[8%] rotate-[-12deg] rounded-md border-[3px] px-4 py-1 text-[2em] font-black tracking-widest opacity-25"
            style={{ borderColor: 'var(--doc-accent)', color: 'var(--doc-accent)' }}
            aria-hidden
          >
            PAID
          </div>
        )}

        <div className="mt-auto space-y-3 pt-6">
          {doc.notes && (
            <div>
              <p className="text-[0.85em] font-semibold uppercase tracking-wider text-neutral-500">Notes</p>
              <p className="whitespace-pre-line">{doc.notes}</p>
            </div>
          )}
          {doc.terms && (
            <div>
              <p className="text-[0.85em] font-semibold uppercase tracking-wider text-neutral-500">
                {doc.kind === 'invoice' ? 'Payment terms' : 'Terms'}
              </p>
              <p className="whitespace-pre-line">{doc.terms}</p>
            </div>
          )}
          {doc.showBranding && (
            <p className="border-t border-neutral-200 pt-2 text-center text-[0.8em] text-neutral-400">
              Created with FreeBizKit · freebizkit-blueprint.netlify.app
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
