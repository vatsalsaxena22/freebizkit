import { describe, expect, it } from 'vitest'
import { computeTotals } from './document'
import { sampleDocument } from '@/data/fixtures'

describe('computeTotals', () => {
  it('applies percent discount before tax', () => {
    const doc = sampleDocument('invoice')
    doc.items = [
      { id: 'a', description: 'Design', quantity: '10', rate: '50' },
      { id: 'b', description: 'Hosting', quantity: '1', rate: '100' },
    ]
    doc.discountType = 'percent'
    doc.discountValue = '10'
    doc.taxRate = '18'
    expect(computeTotals(doc)).toEqual({
      subtotal: 600,
      discount: 60,
      taxable: 540,
      tax: 97.2,
      total: 637.2,
    })
  })

  it('caps a flat discount at the subtotal', () => {
    const doc = sampleDocument('receipt')
    doc.items = [{ id: 'a', description: 'Item', quantity: '1', rate: '20' }]
    doc.discountType = 'flat'
    doc.discountValue = '50'
    doc.taxRate = '0'
    expect(computeTotals(doc).total).toBe(0)
  })
})
