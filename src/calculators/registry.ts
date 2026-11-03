import type { LucideIcon } from 'lucide-react'
import { BadgePercent, Briefcase, Landmark, Percent, Tags, TrendingUp } from 'lucide-react'
import { formatMoney, formatNumber, formatPercent, toNumber } from '@/lib/format'
import { discount, freelanceRate, gst, markup, profitMargin, roi } from './formulas'

export type FieldUnit = 'money' | 'percent' | 'number' | 'hours' | 'weeks' | 'years'

export type CalcField =
  | {
      kind: 'number'
      key: string
      label: string
      unit: FieldUnit
      defaultValue: string
      help?: string
      presets?: number[]
    }
  | {
      kind: 'choice'
      key: string
      label: string
      options: { value: string; label: string }[]
      defaultValue: string
    }

export type CalcValues = Record<string, string>

export type CalcResult = {
  headline: { label: string; value: string }
  rows: { label: string; value: string; emphasis?: boolean }[]
  explanation: string
}

export type CalculatorDef = {
  slug: string
  key: string
  name: string
  shortName: string
  icon: LucideIcon
  blurb: string
  seoTitle: string
  seoDescription: string
  h1: string
  intro: string
  usesCurrency: boolean
  defaultCurrency?: string
  fields: CalcField[]
  compute: (v: CalcValues, currency: string) => CalcResult | null
  formula: { expression: string[]; example: string }
  howTo: string[]
  faqs: { q: string; a: string }[]
  related: string[]
}

const n = (v: CalcValues, k: string) => toNumber(v[k])
const allFinite = (...xs: number[]) => xs.every(Number.isFinite)

export const calculators: CalculatorDef[] = [
  {
    slug: 'gst-calculator',
    key: 'gst_calculator',
    name: 'GST Calculator',
    shortName: 'GST',
    icon: Landmark,
    blurb: 'Add or remove GST from any amount, with a CGST/SGST split.',
    seoTitle: 'GST Calculator — Add or Remove GST Instantly (Free)',
    seoDescription:
      'Free GST calculator. Add GST to a net price or extract GST from a GST-inclusive amount at 5%, 12%, 18%, 28% or any custom rate, with a CGST/SGST breakdown.',
    h1: 'GST Calculator',
    intro:
      'Work out the GST on a price in either direction: add tax to a net amount, or pull the tax back out of a price that already includes it. The breakdown also shows the equal CGST and SGST halves used for intra-state supplies.',
    usesCurrency: true,
    defaultCurrency: 'INR',
    fields: [
      {
        kind: 'choice',
        key: 'mode',
        label: 'What do you want to do?',
        defaultValue: 'add',
        options: [
          { value: 'add', label: 'Add GST' },
          { value: 'remove', label: 'Remove GST' },
        ],
      },
      { kind: 'number', key: 'amount', label: 'Amount', unit: 'money', defaultValue: '10000' },
      {
        kind: 'number',
        key: 'rate',
        label: 'GST rate',
        unit: 'percent',
        defaultValue: '18',
        presets: [5, 12, 18, 28],
      },
    ],
    compute: (v, c) => {
      const amount = n(v, 'amount')
      const rate = n(v, 'rate')
      if (!allFinite(amount, rate)) return null
      const mode = v.mode === 'remove' ? 'remove' : 'add'
      const r = gst(amount, rate, mode)
      return {
        headline:
          mode === 'add'
            ? { label: 'Total including GST', value: formatMoney(r.gross, c) }
            : { label: 'Amount before GST', value: formatMoney(r.net, c) },
        rows: [
          { label: 'Net amount (excl. GST)', value: formatMoney(r.net, c) },
          { label: `GST @ ${formatPercent(rate)}`, value: formatMoney(r.tax, c), emphasis: true },
          { label: 'CGST (half)', value: formatMoney(r.halfTax, c) },
          { label: 'SGST (half)', value: formatMoney(r.halfTax, c) },
          { label: 'Gross amount (incl. GST)', value: formatMoney(r.gross, c) },
        ],
        explanation:
          mode === 'add'
            ? `${formatMoney(r.net, c)} plus ${formatPercent(rate)} GST is ${formatMoney(r.gross, c)}.`
            : `${formatMoney(r.gross, c)} includes ${formatMoney(r.tax, c)} of GST at ${formatPercent(rate)}.`,
      }
    },
    formula: {
      expression: [
        'Add GST:  GST = Net × Rate ÷ 100,  Gross = Net + GST',
        'Remove GST:  Net = Gross ÷ (1 + Rate ÷ 100),  GST = Gross − Net',
      ],
      example:
        'A ₹10,000 service at 18% GST: GST = 10,000 × 0.18 = ₹1,800, so the invoice total is ₹11,800 (CGST ₹900 + SGST ₹900).',
    },
    howTo: [
      'Choose whether your amount excludes GST (add) or already includes it (remove).',
      'Enter the amount and pick a common slab or type a custom rate.',
      'Copy the breakdown straight into your invoice or quotation.',
    ],
    faqs: [
      {
        q: 'How do I remove GST from a GST-inclusive price?',
        a: 'Divide the inclusive price by (1 + rate/100). For 18% GST, divide by 1.18. The difference between the inclusive price and the result is the GST amount.',
      },
      {
        q: 'What is the difference between CGST, SGST and IGST?',
        a: 'For a sale within one state, GST is split equally into Central GST (CGST) and State GST (SGST). For inter-state sales, the full rate is charged as Integrated GST (IGST).',
      },
      {
        q: 'Can I use this for VAT or other sales taxes?',
        a: 'Yes. The arithmetic for adding or removing a percentage-based consumption tax is the same; just enter your local rate and ignore the CGST/SGST split.',
      },
    ],
    related: ['profit-margin-calculator', 'discount-calculator', 'markup-calculator'],
  },
  {
    slug: 'profit-margin-calculator',
    key: 'profit_margin_calculator',
    name: 'Profit Margin Calculator',
    shortName: 'Profit margin',
    icon: TrendingUp,
    blurb: 'See gross profit, margin % and markup % from cost and revenue.',
    seoTitle: 'Profit Margin Calculator — Gross Margin & Markup (Free)',
    seoDescription:
      'Calculate gross profit, profit margin percentage and markup percentage from your cost and selling price. Free, instant and private.',
    h1: 'Profit Margin Calculator',
    intro:
      'Enter what something costs you and what you sell it for. You get gross profit, the margin as a share of revenue, and the equivalent markup on cost — the two numbers people most often mix up.',
    usesCurrency: true,
    fields: [
      { kind: 'number', key: 'cost', label: 'Cost', unit: 'money', defaultValue: '60' },
      {
        kind: 'number',
        key: 'revenue',
        label: 'Selling price (revenue)',
        unit: 'money',
        defaultValue: '100',
      },
    ],
    compute: (v, c) => {
      const cost = n(v, 'cost')
      const revenue = n(v, 'revenue')
      if (!allFinite(cost, revenue)) return null
      const r = profitMargin(cost, revenue)
      return {
        headline: { label: 'Profit margin', value: formatPercent(r.marginPct) },
        rows: [
          { label: 'Gross profit', value: formatMoney(r.profit, c), emphasis: true },
          { label: 'Profit margin', value: formatPercent(r.marginPct) },
          { label: 'Markup on cost', value: formatPercent(r.markupPct) },
        ],
        explanation: `Selling at ${formatMoney(revenue, c)} with a cost of ${formatMoney(cost, c)} keeps ${formatPercent(r.marginPct)} of every sale as gross profit.`,
      }
    },
    formula: {
      expression: [
        'Profit = Revenue − Cost',
        'Margin % = Profit ÷ Revenue × 100',
        'Markup % = Profit ÷ Cost × 100',
      ],
      example: 'Cost $60, price $100: profit $40, margin 40%, markup 66.67%.',
    },
    howTo: [
      'Enter your total cost for the item or job.',
      'Enter the price you charge the customer.',
      'Read margin and markup side by side to price confidently.',
    ],
    faqs: [
      {
        q: 'Is margin the same as markup?',
        a: 'No. Margin is profit as a percentage of the selling price; markup is profit as a percentage of cost. A 50% markup equals a 33.3% margin.',
      },
      {
        q: 'What is a good profit margin?',
        a: 'It varies widely by industry. Service businesses often target 30–60% gross margin, while retail and food commonly run lower. Compare against your own costs and industry benchmarks.',
      },
      {
        q: 'Should cost include overheads?',
        a: 'For gross margin, include only direct costs (materials, direct labour). Include overheads if you want to see a net or contribution margin instead.',
      },
    ],
    related: ['markup-calculator', 'discount-calculator', 'roi-calculator'],
  },
  {
    slug: 'markup-calculator',
    key: 'markup_calculator',
    name: 'Markup Calculator',
    shortName: 'Markup',
    icon: Tags,
    blurb: 'Turn a cost and markup % into a selling price and margin.',
    seoTitle: 'Markup Calculator — Selling Price from Cost (Free)',
    seoDescription:
      'Find the selling price for any cost and markup percentage, plus the profit and resulting margin. Free markup calculator for retailers and freelancers.',
    h1: 'Markup Calculator',
    intro:
      'Know your cost and the markup you want? This calculator gives you the selling price, the profit per unit, and the margin that price actually delivers.',
    usesCurrency: true,
    fields: [
      { kind: 'number', key: 'cost', label: 'Cost', unit: 'money', defaultValue: '80' },
      {
        kind: 'number',
        key: 'markup',
        label: 'Markup',
        unit: 'percent',
        defaultValue: '25',
        presets: [25, 50, 100],
      },
    ],
    compute: (v, c) => {
      const cost = n(v, 'cost')
      const m = n(v, 'markup')
      if (!allFinite(cost, m)) return null
      const r = markup(cost, m)
      return {
        headline: { label: 'Selling price', value: formatMoney(r.price, c) },
        rows: [
          { label: 'Profit per unit', value: formatMoney(r.profit, c), emphasis: true },
          { label: 'Resulting margin', value: formatPercent(r.marginPct) },
        ],
        explanation: `A ${formatPercent(m)} markup on ${formatMoney(cost, c)} gives a price of ${formatMoney(r.price, c)}, which is a ${formatPercent(r.marginPct)} margin.`,
      }
    },
    formula: {
      expression: ['Price = Cost × (1 + Markup ÷ 100)', 'Margin % = (Price − Cost) ÷ Price × 100'],
      example: 'Cost $80 with a 25% markup: price $100, profit $20, margin 20%.',
    },
    howTo: [
      'Enter the unit cost.',
      'Enter or pick a markup percentage.',
      'Use the selling price on your quotation or price list.',
    ],
    faqs: [
      {
        q: 'How do I convert markup to margin?',
        a: 'Margin = Markup ÷ (1 + Markup), using decimals. A 25% markup (0.25) is 0.25 ÷ 1.25 = 20% margin.',
      },
      {
        q: 'What markup do I need for a 50% margin?',
        a: 'A 100% markup — doubling the cost — produces a 50% margin.',
      },
    ],
    related: ['profit-margin-calculator', 'discount-calculator', 'gst-calculator'],
  },
  {
    slug: 'discount-calculator',
    key: 'discount_calculator',
    name: 'Discount Calculator',
    shortName: 'Discount',
    icon: BadgePercent,
    blurb: 'Final price and savings, including stacked discounts.',
    seoTitle: 'Discount Calculator — Sale Price & Savings (Free)',
    seoDescription:
      'Calculate the sale price after a percentage discount, the amount saved, and the effective rate of stacked discounts like 20% + 10% off.',
    h1: 'Discount Calculator',
    intro:
      'Find the price after a discount and how much is saved. Add a second discount to see why “20% + 10% off” is not the same as 30% off.',
    usesCurrency: true,
    fields: [
      { kind: 'number', key: 'price', label: 'Original price', unit: 'money', defaultValue: '200' },
      {
        kind: 'number',
        key: 'discount',
        label: 'Discount',
        unit: 'percent',
        defaultValue: '20',
        presets: [10, 15, 20, 25, 50],
      },
      {
        kind: 'number',
        key: 'extra',
        label: 'Extra discount (optional)',
        unit: 'percent',
        defaultValue: '0',
        help: 'Applied after the first discount.',
      },
    ],
    compute: (v, c) => {
      const price = n(v, 'price')
      const d = n(v, 'discount')
      const extra = Number.isFinite(n(v, 'extra')) ? n(v, 'extra') : 0
      if (!allFinite(price, d)) return null
      const r = discount(price, d, extra)
      return {
        headline: { label: 'Final price', value: formatMoney(r.final, c) },
        rows: [
          { label: 'You save', value: formatMoney(r.saved, c), emphasis: true },
          { label: 'Effective discount', value: formatPercent(r.effectivePct) },
        ],
        explanation: `${formatMoney(price, c)} with ${formatPercent(d)}${extra ? ` + ${formatPercent(extra)}` : ''} off comes to ${formatMoney(r.final, c)}.`,
      }
    },
    formula: {
      expression: ['Final = Price × (1 − D1 ÷ 100) × (1 − D2 ÷ 100)', 'Saved = Price − Final'],
      example:
        '$200 with 20% then 10% off: 200 × 0.8 × 0.9 = $144. You save $56 — an effective 28%.',
    },
    howTo: [
      'Enter the original price.',
      'Enter the discount percentage, and an optional second discount.',
      'See the final price, savings and effective rate.',
    ],
    faqs: [
      {
        q: 'Are stacked discounts added together?',
        a: 'No. The second discount applies to the already-reduced price, so 20% + 10% equals 28% off, not 30%.',
      },
      {
        q: 'How do I find the original price from a sale price?',
        a: 'Divide the sale price by (1 − discount/100). A $72 item at 20% off was originally 72 ÷ 0.8 = $90.',
      },
    ],
    related: ['markup-calculator', 'profit-margin-calculator', 'gst-calculator'],
  },
  {
    slug: 'freelance-rate-calculator',
    key: 'freelance_rate_calculator',
    name: 'Freelance Hourly Rate Calculator',
    shortName: 'Freelance rate',
    icon: Briefcase,
    blurb: 'Work back from your target income to an hourly and day rate.',
    seoTitle: 'Freelance Hourly Rate Calculator — What Should I Charge?',
    seoDescription:
      'Calculate the hourly and day rate you need as a freelancer from your target take-home pay, business expenses, taxes, billable hours and time off.',
    h1: 'Freelance Hourly Rate Calculator',
    intro:
      'Start from the income you want to take home, then account for tax, business costs, holidays and the reality that not every working hour is billable. The result is the minimum rate that gets you there.',
    usesCurrency: true,
    fields: [
      {
        kind: 'number',
        key: 'income',
        label: 'Target take-home income (per year)',
        unit: 'money',
        defaultValue: '60000',
      },
      {
        kind: 'number',
        key: 'expenses',
        label: 'Business expenses (per year)',
        unit: 'money',
        defaultValue: '6000',
        help: 'Software, equipment, insurance, coworking…',
      },
      {
        kind: 'number',
        key: 'tax',
        label: 'Estimated tax rate',
        unit: 'percent',
        defaultValue: '25',
      },
      {
        kind: 'number',
        key: 'hours',
        label: 'Billable hours per week',
        unit: 'hours',
        defaultValue: '25',
        help: 'Exclude admin, sales and learning time.',
      },
      {
        kind: 'number',
        key: 'weeks',
        label: 'Working weeks per year',
        unit: 'weeks',
        defaultValue: '46',
      },
      {
        kind: 'number',
        key: 'buffer',
        label: 'Profit / safety buffer',
        unit: 'percent',
        defaultValue: '10',
      },
    ],
    compute: (v, c) => {
      const vals = {
        targetIncome: n(v, 'income'),
        expenses: n(v, 'expenses'),
        taxPct: n(v, 'tax'),
        hoursPerWeek: n(v, 'hours'),
        weeksPerYear: n(v, 'weeks'),
        bufferPct: n(v, 'buffer'),
      }
      if (!allFinite(...Object.values(vals))) return null
      const r = freelanceRate(vals)
      return {
        headline: { label: 'Minimum hourly rate', value: formatMoney(r.hourly, c) },
        rows: [
          { label: 'Day rate (8 h)', value: formatMoney(r.daily, c), emphasis: true },
          { label: 'Revenue needed per year', value: formatMoney(r.revenueNeeded, c) },
          { label: 'Revenue needed per month', value: formatMoney(r.monthly, c) },
          { label: 'Billable hours per year', value: formatNumber(r.billableHours, 0) },
        ],
        explanation: `To take home ${formatMoney(vals.targetIncome, c)} you need to bill about ${formatMoney(r.revenueNeeded, c)} a year — ${formatMoney(r.hourly, c)} for each of your ${formatNumber(r.billableHours, 0)} billable hours.`,
      }
    },
    formula: {
      expression: [
        'Revenue = (Income ÷ (1 − Tax ÷ 100) + Expenses) × (1 + Buffer ÷ 100)',
        'Hourly rate = Revenue ÷ (Hours per week × Weeks per year)',
      ],
      example:
        '$60,000 take-home, $6,000 costs, 25% tax, no buffer, 25 h × 46 weeks: (80,000 + 6,000) ÷ 1,150 ≈ $74.78 per hour.',
    },
    howTo: [
      'Enter what you want to earn after tax and your yearly business costs.',
      'Be honest about billable hours — 20–30 per week is typical.',
      'Add a buffer for slow months, then round your rate up.',
    ],
    faqs: [
      {
        q: 'Why are billable hours lower than working hours?',
        a: 'Freelancers spend significant time on sales, admin, invoicing and learning. Pricing as if every hour were billable is the most common reason freelancers undercharge.',
      },
      {
        q: 'Should I charge hourly or per project?',
        a: 'Use the hourly rate as your floor. For projects, estimate the hours, multiply by this rate, then add a margin for risk and scope changes.',
      },
    ],
    related: ['profit-margin-calculator', 'roi-calculator', 'gst-calculator'],
  },
  {
    slug: 'roi-calculator',
    key: 'roi_calculator',
    name: 'ROI Calculator',
    shortName: 'ROI',
    icon: Percent,
    blurb: 'Return on investment plus the annualised rate over time.',
    seoTitle: 'ROI Calculator — Return on Investment & Annualised ROI',
    seoDescription:
      'Calculate return on investment (ROI), net gain and annualised return for marketing spend, equipment, or any business investment. Free and instant.',
    h1: 'ROI Calculator',
    intro:
      'Compare what you put in with what you got back. Add the time period to see the annualised return, which makes investments of different lengths comparable.',
    usesCurrency: true,
    fields: [
      {
        kind: 'number',
        key: 'invested',
        label: 'Amount invested',
        unit: 'money',
        defaultValue: '1000',
      },
      {
        kind: 'number',
        key: 'returned',
        label: 'Amount returned',
        unit: 'money',
        defaultValue: '1210',
      },
      { kind: 'number', key: 'years', label: 'Time period', unit: 'years', defaultValue: '2' },
    ],
    compute: (v, c) => {
      const invested = n(v, 'invested')
      const returned = n(v, 'returned')
      const years = n(v, 'years')
      if (!allFinite(invested, returned)) return null
      const r = roi(invested, returned, Number.isFinite(years) ? years : 0)
      return {
        headline: { label: 'Return on investment', value: formatPercent(r.roiPct) },
        rows: [
          { label: 'Net gain', value: formatMoney(r.gain, c), emphasis: true },
          { label: 'Annualised return', value: formatPercent(r.annualizedPct) },
        ],
        explanation: `${formatMoney(invested, c)} growing to ${formatMoney(returned, c)} is a ${formatPercent(r.roiPct)} return${Number.isFinite(r.annualizedPct) ? `, or ${formatPercent(r.annualizedPct)} per year` : ''}.`,
      }
    },
    formula: {
      expression: [
        'ROI % = (Returned − Invested) ÷ Invested × 100',
        'Annualised % = ((Returned ÷ Invested)^(1 ÷ Years) − 1) × 100',
      ],
      example: '$1,000 becomes $1,210 over 2 years: ROI 21%, annualised 10% per year.',
    },
    howTo: [
      'Enter the total amount invested, including fees.',
      'Enter the total value or revenue returned.',
      'Add the number of years to compare against other options.',
    ],
    faqs: [
      {
        q: 'What is the difference between ROI and annualised ROI?',
        a: 'ROI is the total return over the whole period. Annualised ROI spreads that return across each year with compounding, so a 2-year and a 5-year investment can be compared fairly.',
      },
      {
        q: 'How do I calculate marketing ROI?',
        a: 'Use the campaign cost as the amount invested and the gross profit (not revenue) generated by the campaign as the amount returned, for a truer picture.',
      },
    ],
    related: ['profit-margin-calculator', 'freelance-rate-calculator', 'markup-calculator'],
  },
]

/** Calculators on the roadmap, shown on the index as upcoming. */
export const upcomingCalculators = [
  'Percentage Calculator',
  'Salary-to-Hourly Calculator',
  'Break-even Calculator',
  'Commission Calculator',
  'CAGR Calculator',
  'Invoice Tax Calculator',
  'EMI Calculator',
]

export function getCalculator(slug: string) {
  return calculators.find((c) => c.slug === slug)
}
