import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate } from './format'

describe('format utilities', () => {
  it('formats currency with two decimal places', () => {
    expect(formatCurrency(25)).toBe('$25.00')
    expect(formatCurrency(25.5)).toBe('$25.50')
  })

  it('formats dates consistently', () => {
    expect(formatDate('2026-01-15T12:00:00.000Z')).toBe('Jan 15, 2026')
  })
})
