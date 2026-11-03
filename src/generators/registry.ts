import type { LucideIcon } from 'lucide-react'
import { FileCheck2, FileSpreadsheet, ReceiptText } from 'lucide-react'
import type { DocumentKind } from './document'

export type GeneratorDef = {
  slug: string
  key: string
  kind: DocumentKind
  name: string
  docTitle: string
  numberPrefix: string
  icon: LucideIcon
  blurb: string
  seoTitle: string
  seoDescription: string
  h1: string
  intro: string
  secondaryDateLabel: string | null
  howTo: string[]
  faqs: { q: string; a: string }[]
  related: string[]
}

export const generators: GeneratorDef[] = [
  {
    slug: 'invoice-generator',
    key: 'invoice_generator',
    kind: 'invoice',
    name: 'Invoice Generator',
    docTitle: 'Invoice',
    numberPrefix: 'INV',
    icon: FileSpreadsheet,
    blurb: 'Professional invoices with tax, discounts and payment terms.',
    seoTitle: 'Free Invoice Generator — Create & Download a PDF Invoice',
    seoDescription:
      'Create a professional invoice online for free. Add your logo, line items, tax and discounts, preview it live, and download or print a PDF. No sign-up required.',
    h1: 'Free Invoice Generator',
    intro:
      'Fill in your details on the left and watch the invoice build itself on the right. Totals, tax and discounts update as you type, and you can export a PDF or sign in to save an editable copy.',
    secondaryDateLabel: 'Due date',
    howTo: [
      'Add your business and client details, plus your logo if you have one.',
      'List each product or service with quantity and rate — totals calculate automatically.',
      'Set tax, discount, notes and payment terms, then choose Download PDF.',
    ],
    faqs: [
      {
        q: 'Is this invoice generator really free?',
        a: 'Yes. You can create, download and print as many invoices as you like without an account. A small “Created with FreeBizKit” line is included by default and can be switched off.',
      },
      {
        q: 'Is my invoice data uploaded anywhere?',
        a: 'Editing and PDF export run entirely in your browser. Data is uploaded only when you choose to save a document, profile or logo to your optional account.',
      },
      {
        q: 'How do I save the invoice as a PDF?',
        a: 'Click Download PDF and choose “Save as PDF” as the destination in the print dialog. The layout is designed to fit on an A4 or Letter page.',
      },
      {
        q: 'What should an invoice include?',
        a: 'At minimum: a unique invoice number, issue and due dates, your business and client details, an itemised list with prices, tax, the total due and how to pay.',
      },
    ],
    related: ['quotation-generator', 'receipt-generator'],
  },
  {
    slug: 'quotation-generator',
    key: 'quotation_generator',
    kind: 'quotation',
    name: 'Quotation Generator',
    docTitle: 'Quotation',
    numberPrefix: 'QUO',
    icon: FileCheck2,
    blurb: 'Send clear, itemised quotes with a validity date.',
    seoTitle: 'Free Quotation Generator — Create a Price Quote PDF',
    seoDescription:
      'Make a professional quotation or price quote in minutes. Itemised pricing, tax, discounts, validity date and terms — preview live and download as PDF, free.',
    h1: 'Free Quotation Generator',
    intro:
      'Put together a polished quote for a prospective client. Set how long the price is valid, spell out what is included, and send a clean PDF that makes saying yes easy.',
    secondaryDateLabel: 'Valid until',
    howTo: [
      'Enter your details and the prospective client’s.',
      'Itemise the work or products you are quoting for.',
      'Set a validity date and terms, then download the PDF.',
    ],
    faqs: [
      {
        q: 'What is the difference between a quotation and an estimate?',
        a: 'A quotation is a fixed price offer valid for a set period; an estimate is an approximate cost that may change. Use a quotation when the scope is well defined.',
      },
      {
        q: 'How long should a quotation be valid?',
        a: '14 to 30 days is common. Shorter validity protects you when material or labour costs change quickly.',
      },
      {
        q: 'Can I turn a quotation into an invoice?',
        a: 'Today you can copy the same details into the invoice generator. One-click conversion between documents is planned for saved accounts.',
      },
    ],
    related: ['invoice-generator', 'receipt-generator'],
  },
  {
    slug: 'receipt-generator',
    key: 'receipt_generator',
    kind: 'receipt',
    name: 'Receipt Generator',
    docTitle: 'Receipt',
    numberPrefix: 'RCT',
    icon: ReceiptText,
    blurb: 'Payment receipts with method, items and a paid stamp.',
    seoTitle: 'Free Receipt Generator — Create a Payment Receipt PDF',
    seoDescription:
      'Create a payment receipt online for free. Record what was paid, how and when, with itemised amounts and tax. Download or print as PDF instantly.',
    h1: 'Free Receipt Generator',
    intro:
      'Confirm a payment with a tidy, itemised receipt. Record the payment method and date, and hand your customer a clear record for their books.',
    secondaryDateLabel: null,
    howTo: [
      'Enter your business details and who paid.',
      'List what was paid for and how it was paid.',
      'Download or print the receipt for your customer.',
    ],
    faqs: [
      {
        q: 'Is a receipt the same as an invoice?',
        a: 'No. An invoice requests payment; a receipt confirms that payment has been received.',
      },
      {
        q: 'What details does a receipt need?',
        a: 'The seller, the buyer, a receipt number, the date of payment, what was purchased, the amount paid including tax, and the payment method.',
      },
    ],
    related: ['invoice-generator', 'quotation-generator'],
  },
]

/** Document generators on the roadmap. */
export const upcomingGenerators = [
  'Proforma Invoice Generator',
  'Purchase Order Generator',
  'Estimate Generator',
  'Salary Slip Generator',
  'Freelance Contract Generator',
]

export function getGenerator(slug: string) {
  return generators.find((g) => g.slug === slug)
}
