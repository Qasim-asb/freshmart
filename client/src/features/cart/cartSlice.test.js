import { describe, expect, it } from 'vitest'
import cartReducer, { addToCart, clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from './cartSlice'

const product = {
  id: '1',
  name: 'Apples',
  price: 3
}

describe('cartSlice', () => {
  it('adds a product to the cart', () => {
    const state = cartReducer(
      undefined,
      addToCart({ product })
    )

    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({ ...product, quantity: 1 })
  })

  it('increases quantity when adding an existing product', () => {
    let state = cartReducer(
      undefined,
      addToCart({ product })
    )

    state = cartReducer(
      state,
      addToCart({ product, quantity: 2 })
    )

    expect(state.items[0].quantity).toBe(3)
  })

  it('increases and decreases quantity', () => {
    let state = cartReducer(
      undefined,
      addToCart({ product, quantity: 2 })
    )

    state = cartReducer(state, increaseQuantity(product.id))
    expect(state.items[0].quantity).toBe(3)

    state = cartReducer(state, decreaseQuantity(product.id))
    expect(state.items[0].quantity).toBe(2)
  })

  it('does not decrease quantity below one', () => {
    let state = cartReducer(
      undefined,
      addToCart({ product })
    )

    state = cartReducer(state, decreaseQuantity(product.id))

    expect(state.items[0].quantity).toBe(1)
  })

  it('removes a product from the cart', () => {
    let state = cartReducer(
      undefined,
      addToCart({ product })
    )

    state = cartReducer(state, removeFromCart(product.id))

    expect(state.items).toHaveLength(0)
  })

  it('clears the cart', () => {
    let state = cartReducer(
      undefined,
      addToCart({ product })
    )

    state = cartReducer(state, clearCart)

    expect(state.items).toHaveLength(0)
  })
})
