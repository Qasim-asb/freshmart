import { describe, expect, it } from 'vitest'
import ordersReducer, { addOrder, clearOrders } from './ordersSlice'

const order = {
  id: 'order-1',
  total: 25,
  items: []
}

describe('ordersSlice', () => {
  it('adds an order to the beginning of the list', () => {
    const state = ordersReducer(
      undefined,
      addOrder(order)
    )

    expect(state.orders).toHaveLength(1)
    expect(state.orders[0]).toEqual(order)
  })

  it('keeps the newest order first', () => {
    let state = ordersReducer(
      undefined,
      addOrder({ ...order, id: 'order-1' })
    )

    state = ordersReducer(
      state,
      addOrder({ ...order, id: 'order-2' })
    )

    expect(state.orders.map((item) => item.id)).toEqual(['order-2', 'order-1'])
  })

  it('clears all orders', () => {
    let state = ordersReducer(
      undefined,
      addOrder(order)
    )

    state = ordersReducer(state, clearOrders)

    expect(state.orders).toHaveLength(0)
  })
})
