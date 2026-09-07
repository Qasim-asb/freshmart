import { describe, expect, it } from 'vitest'
import favoritesReducer, { clearFavorites, toggleFavorite } from './favoritesSlice'

const product = {
  id: '1',
  name: 'Apples',
  price: 3
}

describe('favoritesSlice', () => {
  it('adds a product to favorites', () => {
    const state = favoritesReducer(
      undefined,
      toggleFavorite(product)
    )

    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toEqual(product)
  })

  it('removes an existing product when toggled again', () => {
    let state = favoritesReducer(
      undefined,
      toggleFavorite(product)
    )

    state = favoritesReducer(state, toggleFavorite(product))

    expect(state.items).toHaveLength(0)
  })

  it('does not create duplicate favorites', () => {
    let state = favoritesReducer(
      undefined,
      toggleFavorite(product)
    )

    state = favoritesReducer(state, toggleFavorite(product))

    expect(state.items.filter((item) => item.id === product.id)).toHaveLength(0)
  })

  it('clears all favorites', () => {
    let state = favoritesReducer(
      undefined,
      toggleFavorite(product)
    )

    state = favoritesReducer(state, clearFavorites)

    expect(state.items).toHaveLength(0)
  })
})
