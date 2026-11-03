export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar ($)' },
  { code: 'INR', label: 'Indian Rupee (₹)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'GBP', label: 'British Pound (£)' },
  { code: 'AUD', label: 'Australian Dollar (A$)' },
  { code: 'CAD', label: 'Canadian Dollar (C$)' },
  { code: 'SGD', label: 'Singapore Dollar (S$)' },
  { code: 'AED', label: 'UAE Dirham (AED)' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']

export function formatMoney(value: number, currency: string = 'USD') {
  if (!Number.isFinite(value)) return '—'
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return value.toFixed(2)
  }
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatPercent(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—'
  return `${formatNumber(value, digits)}%`
}

/** Parse user-typed numeric input; empty or invalid input becomes NaN. */
export function toNumber(raw: string | number | undefined): number {
  if (typeof raw === 'number') return raw
  if (raw === undefined || raw.trim() === '') return NaN
  return Number(raw.replace(/,/g, ''))
}

/** Round to cents to avoid floating point drift in money totals. */
export function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
