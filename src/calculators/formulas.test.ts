import { describe, expect, it } from 'vitest'
import { discount, freelanceRate, gst, markup, profitMargin, roi } from './formulas'

describe('calculator formulas', () => {
  it('adds GST to a net amount', () => {
    expect(gst(1000, 18, 'add')).toEqual({ net: 1000, tax: 180, gross: 1180, halfTax: 90 })
  })

  it('removes GST from a gross amount', () => {
    expect(gst(1180, 18, 'remove')).toEqual({ net: 1000, tax: 180, gross: 1180, halfTax: 90 })
  })

  it('computes profit margin and markup', () => {
    const r = profitMargin(60, 100)
    expect(r.profit).toBe(40)
    expect(r.marginPct).toBeCloseTo(40)
    expect(r.markupPct).toBeCloseTo(66.6667, 3)
  })

  it('computes selling price from markup', () => {
    const r = markup(80, 25)
    expect(r.price).toBe(100)
    expect(r.profit).toBe(20)
    expect(r.marginPct).toBeCloseTo(20)
  })

  it('stacks discounts', () => {
    const r = discount(200, 20, 10)
    expect(r.final).toBe(144)
    expect(r.saved).toBe(56)
    expect(r.effectivePct).toBeCloseTo(28)
  })

  it('computes a freelance hourly rate', () => {
    const r = freelanceRate({
      targetIncome: 60000,
      expenses: 6000,
      taxPct: 25,
      hoursPerWeek: 25,
      weeksPerYear: 46,
      bufferPct: 0,
    })
    expect(r.revenueNeeded).toBe(86000)
    expect(r.billableHours).toBe(1150)
    expect(r.hourly).toBeCloseTo(74.78, 2)
  })

  it('computes ROI and annualized return', () => {
    const r = roi(1000, 1210, 2)
    expect(r.gain).toBe(210)
    expect(r.roiPct).toBeCloseTo(21)
    expect(r.annualizedPct).toBeCloseTo(10)
  })
})
