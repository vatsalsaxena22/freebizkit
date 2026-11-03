/**
 * Pure calculator formulas. No React, no I/O — every calculator page in
 * FreeBizKit runs entirely in the browser using these functions.
 * Each function is covered by known-value tests in formulas.test.ts.
 */
import { round2 } from '@/lib/format'

export function gst(amount: number, ratePct: number, mode: 'add' | 'remove') {
  if (mode === 'add') {
    const tax = (amount * ratePct) / 100
    return {
      net: round2(amount),
      tax: round2(tax),
      gross: round2(amount + tax),
      halfTax: round2(tax / 2),
    }
  }
  const net = amount / (1 + ratePct / 100)
  const tax = amount - net
  return {
    net: round2(net),
    tax: round2(tax),
    gross: round2(amount),
    halfTax: round2(tax / 2),
  }
}

export function profitMargin(cost: number, revenue: number) {
  const profit = revenue - cost
  return {
    profit: round2(profit),
    marginPct: revenue === 0 ? NaN : (profit / revenue) * 100,
    markupPct: cost === 0 ? NaN : (profit / cost) * 100,
  }
}

export function markup(cost: number, markupPct: number) {
  const price = cost * (1 + markupPct / 100)
  const profit = price - cost
  return {
    price: round2(price),
    profit: round2(profit),
    marginPct: price === 0 ? NaN : (profit / price) * 100,
  }
}

export function discount(price: number, discountPct: number, extraPct = 0) {
  const afterFirst = price * (1 - discountPct / 100)
  const final = afterFirst * (1 - extraPct / 100)
  const saved = price - final
  return {
    final: round2(final),
    saved: round2(saved),
    effectivePct: price === 0 ? NaN : (saved / price) * 100,
  }
}

export function freelanceRate(input: {
  targetIncome: number
  expenses: number
  taxPct: number
  hoursPerWeek: number
  weeksPerYear: number
  bufferPct: number
}) {
  const { targetIncome, expenses, taxPct, hoursPerWeek, weeksPerYear, bufferPct } = input
  const beforeTax = taxPct >= 100 ? NaN : targetIncome / (1 - taxPct / 100)
  const revenueNeeded = (beforeTax + expenses) * (1 + bufferPct / 100)
  const billableHours = hoursPerWeek * weeksPerYear
  const hourly = billableHours === 0 ? NaN : revenueNeeded / billableHours
  return {
    revenueNeeded: round2(revenueNeeded),
    billableHours,
    hourly: round2(hourly),
    daily: round2(hourly * 8),
    monthly: round2(revenueNeeded / 12),
  }
}

export function roi(invested: number, returned: number, years: number) {
  const gain = returned - invested
  const roiPct = invested === 0 ? NaN : (gain / invested) * 100
  const annualizedPct =
    invested > 0 && returned >= 0 && years > 0
      ? (Math.pow(returned / invested, 1 / years) - 1) * 100
      : NaN
  return { gain: round2(gain), roiPct, annualizedPct }
}
