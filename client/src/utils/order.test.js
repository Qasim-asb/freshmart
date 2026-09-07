import { describe, expect, it } from 'vitest'
import { calculateDeliveryFee, calculateOrderTotal, calculateSubtotal, calculateTotalItems, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from './order'

describe('order utilities', () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ]

  it('calculates the subtotal', () => {
    expect(calculateSubtotal(items)).toBe(35)
  })

  it('calculates total items', () => {
    expect(calculateTotalItems(items)).toBe(5)
  })

  it('charges delivery below the free delivery threshold', () => {
    expect(calculateDeliveryFee(FREE_DELIVERY_THRESHOLD - 1)).toBe(DELIVERY_FEE)
  })

  it('provides free delivery at the threshold', () => {
    expect(calculateDeliveryFee(FREE_DELIVERY_THRESHOLD)).toBe(0)
  })

  it('calculates the complete order total', () => {
    expect(calculateOrderTotal(40)).toBe(45)
    expect(calculateOrderTotal(50)).toBe(50)
  })
})
