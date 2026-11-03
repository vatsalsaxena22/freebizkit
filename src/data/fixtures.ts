/**
 * Sample data used to pre-fill generators so a first-time visitor sees a
 * realistic document immediately. When accounts arrive (see PLAN.md), the
 * "from" party will be replaced by the signed-in user's saved business profile.
 */
import type { DocumentData, DocumentKind } from '@/generators/document'

export const ACCENT_PRESETS = [
  { name: 'Ledger green', value: '#1f7a5a' },
  { name: 'Ink blue', value: '#24407a' },
  { name: 'Terracotta', value: '#b4532a' },
  { name: 'Plum', value: '#6b3a73' },
  { name: 'Graphite', value: '#2b2f36' },
]

const today = () => new Date().toISOString().slice(0, 10)
const plusDays = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const prefix: Record<DocumentKind, string> = {
  invoice: 'INV',
  quotation: 'QUO',
  receipt: 'RCT',
}

export function sampleDocument(kind: DocumentKind): DocumentData {
  return {
    kind,
    number: `${prefix[kind]}-0001`,
    issueDate: today(),
    secondaryDate: kind === 'receipt' ? '' : plusDays(kind === 'invoice' ? 14 : 30),
    currency: 'USD',
    from: {
      name: 'Northwind Studio',
      email: 'hello@northwind.studio',
      phone: '+1 415 555 0142',
      address: '88 Harbor Lane, Suite 4\nSan Francisco, CA 94107',
      taxId: '',
    },
    to: {
      name: 'Bluebird Coffee Co.',
      email: 'accounts@bluebird.coffee',
      phone: '',
      address: '12 Market Street\nPortland, OR 97204',
      taxId: '',
    },
    items: [
      { id: 'i1', description: 'Brand identity design', quantity: '1', rate: '1800' },
      { id: 'i2', description: 'Website landing page', quantity: '1', rate: '1200' },
      { id: 'i3', description: 'Copywriting (hours)', quantity: '6', rate: '75' },
    ],
    taxLabel: 'Tax',
    taxRate: '8',
    discountType: 'percent',
    discountValue: '0',
    paymentMethod: 'Bank transfer',
    notes:
      kind === 'quotation'
        ? 'Includes two rounds of revisions. Additional changes billed at $75/hour.'
        : 'Thank you for your business!',
    terms:
      kind === 'invoice'
        ? 'Payment due within 14 days. Bank: First Harbor Bank · Acct 0012 3456 7890'
        : kind === 'quotation'
          ? '50% deposit to begin work, balance on delivery.'
          : '',
    accent: ACCENT_PRESETS[0].value,
    showBranding: true,
  }
}
