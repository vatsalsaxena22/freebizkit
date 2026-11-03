import { round2 } from '@/lib/format'

export type DocumentKind = 'invoice' | 'quotation' | 'receipt'

export type LineItem = {
  id: string
  description: string
  quantity: string
  rate: string
}

export type Party = {
  name: string
  email: string
  phone: string
  address: string
  taxId: string
}

export type DocumentData = {
  kind: DocumentKind
  number: string
  issueDate: string
  /** Due date (invoice), valid-until date (quotation) or unused (receipt). */
  secondaryDate: string
  currency: string
  from: Party
  to: Party
  items: LineItem[]
  taxLabel: string
  taxRate: string
  discountType: 'percent' | 'flat'
  discountValue: string
  /** Receipt only. */
  paymentMethod: string
  notes: string
  terms: string
  accent: string
  showBranding: boolean
}

const num = (s: string) => {
  const v = Number(s)
  return Number.isFinite(v) ? v : 0
}

export function lineAmount(item: LineItem) {
  return round2(num(item.quantity) * num(item.rate))
}

export function computeTotals(doc: DocumentData) {
  const subtotal = round2(doc.items.reduce((sum, it) => sum + lineAmount(it), 0))
  const rawDiscount =
    doc.discountType === 'percent'
      ? (subtotal * num(doc.discountValue)) / 100
      : num(doc.discountValue)
  const discount = round2(Math.min(Math.max(rawDiscount, 0), subtotal))
  const taxable = round2(subtotal - discount)
  const tax = round2((taxable * num(doc.taxRate)) / 100)
  const total = round2(taxable + tax)
  return { subtotal, discount, taxable, tax, total }
}

export function newItem(): LineItem {
  return {
    id: Math.random().toString(36).slice(2, 10),
    description: '',
    quantity: '1',
    rate: '0',
  }
}
