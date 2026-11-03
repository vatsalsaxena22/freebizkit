import { z } from 'zod'
const text = z.string().max(2000)
const number = z
  .string()
  .max(30)
  .refine(
    (v) => v.trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 1000000,
    'Use a valid non-negative number',
  )
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) => !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v,
    'Use a valid date',
  )
export const partySchema = z.object({
  name: text,
  email: text,
  phone: text,
  address: text,
  taxId: text,
})
export const profileSchema = z.object({
  from: partySchema,
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  currency: z.enum(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'AED', 'SGD']),
})
export const documentSchema = z
  .object({
    kind: z.enum(['invoice', 'quotation', 'receipt']),
    number: z.string().trim().min(1).max(100),
    issueDate: date,
    secondaryDate: z.union([date, z.literal('')]),
    currency: profileSchema.shape.currency,
    from: partySchema,
    to: partySchema,
    items: z
      .array(
        z.object({
          id: z.string().max(100),
          description: text,
          quantity: number,
          rate: number,
        }),
      )
      .min(1)
      .max(100),
    taxLabel: z.string().max(100),
    taxRate: number.refine((v) => Number(v) <= 100, 'Tax must be 0–100%'),
    discountType: z.enum(['percent', 'flat']),
    discountValue: number,
    paymentMethod: text,
    notes: text,
    terms: text,
    accent: profileSchema.shape.accent,
    showBranding: z.boolean(),
  })
  .refine((d) => d.discountType !== 'percent' || Number(d.discountValue) <= 100, {
    message: 'Discount must be 0–100%',
    path: ['discountValue'],
  })
