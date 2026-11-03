import { useMemo, useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import type { CalcField, CalcValues, CalculatorDef, FieldUnit } from '@/calculators/registry'
import { CURRENCIES } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const unitSuffix: Record<FieldUnit, string> = {
  money: '',
  percent: '%',
  number: '',
  hours: 'hrs',
  weeks: 'wks',
  years: 'yrs',
}

function defaults(fields: CalcField[]): CalcValues {
  return Object.fromEntries(fields.map((f) => [f.key, f.defaultValue]))
}

export function CalculatorView({ calc }: { calc: CalculatorDef }) {
  const [values, setValues] = useState<CalcValues>(() => defaults(calc.fields))
  const [currency, setCurrency] = useState(calc.defaultCurrency ?? 'USD')
  const result = useMemo(() => calc.compute(values, currency), [calc, values, currency])
  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }))

  const copy = async () => {
    if (!result) return
    const text = [
      `${calc.name} — ${result.headline.label}: ${result.headline.value}`,
      ...result.rows.map((r) => `${r.label}: ${r.value}`),
    ].join('\n')
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Result copied to clipboard')
    } catch {
      toast.error('Couldn’t access the clipboard')
    }
  }

  return (
    <div className="grid overflow-hidden rounded-xl border bg-card shadow-sm lg:grid-cols-[1.1fr_1fr]">
      <form
        className="space-y-5 p-5 sm:p-7"
        onSubmit={(e) => e.preventDefault()}
        aria-label={`${calc.name} inputs`}
      >
        {calc.usesCurrency && (
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency" className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {calc.fields.map((field) =>
          field.kind === 'choice' ? (
            <fieldset key={field.key} className="space-y-2">
              <legend className="text-sm font-medium">{field.label}</legend>
              <div className="inline-flex rounded-lg border bg-muted p-1" role="radiogroup">
                {field.options.map((opt) => {
                  const active = values[field.key] === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => set(field.key, opt.value)}
                      className={cn(
                        'rounded-md px-4 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none',
                        active
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ) : (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <div className="relative">
                <Input
                  id={field.key}
                  inputMode="decimal"
                  value={values[field.key]}
                  onChange={(e) => set(field.key, e.target.value)}
                  className={cn('tabular h-11 text-base', field.unit === 'money' ? 'pl-14' : 'pr-12')}
                  aria-describedby={field.help ? `${field.key}-help` : undefined}
                />
                {field.unit === 'money' ? (
                  <span className="tabular pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-muted-foreground">
                    {currency}
                  </span>
                ) : (
                  unitSuffix[field.unit] && (
                    <span className="tabular pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                      {unitSuffix[field.unit]}
                    </span>
                  )
                )}
              </div>
              {field.presets && (
                <div className="flex flex-wrap gap-2">
                  {field.presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => set(field.key, String(p))}
                      className={cn(
                        'tabular rounded-full border px-3 py-1 text-xs transition-colors motion-reduce:transition-none',
                        values[field.key] === String(p)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'hover:border-primary',
                      )}
                    >
                      {p}
                      {unitSuffix[field.unit]}
                    </button>
                  ))}
                </div>
              )}
              {field.help && (
                <p id={`${field.key}-help`} className="text-xs text-muted-foreground">
                  {field.help}
                </p>
              )}
            </div>
          ),
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setValues(defaults(calc.fields))
            setCurrency(calc.defaultCurrency ?? 'USD')
          }}
        >
          <RotateCcw /> Reset to example
        </Button>
      </form>

      <div className="ledger-bg flex flex-col border-t bg-secondary/50 p-5 sm:p-7 lg:border-t-0 lg:border-l" aria-live="polite">
        {result ? (
          <>
            <p className="text-sm font-medium text-muted-foreground">{result.headline.label}</p>
            <p className="tabular mt-1 break-words text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
              {result.headline.value}
            </p>
            <dl className="mt-6 divide-y rounded-lg border bg-card">
              {result.rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-muted-foreground">{row.label}</dt>
                  <dd className={cn('tabular text-right', row.emphasis && 'font-semibold')}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed">{result.explanation}</p>
            <div className="mt-auto pt-6">
              <Button type="button" variant="outline" size="sm" onClick={copy}>
                <Copy /> Copy result
              </Button>
            </div>
          </>
        ) : (
          <div className="m-auto max-w-xs text-center text-sm text-muted-foreground">
            Enter valid numbers in every field to see the result.
          </div>
        )}
      </div>
    </div>
  )
}
