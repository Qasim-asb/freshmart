import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import ordersReducer from '../features/orders/ordersSlice'

const loadFromStorage = (key) => {
  try {
    const savedData = localStorage.getItem(key)

    return savedData ? JSON.parse(savedData) : undefined
  } catch {
    return undefined
  }
}

let saveTimeout

const saveToStorage = () => {
  clearTimeout(saveTimeout)

  saveTimeout = setTimeout(() => {
    try {
      const state = store.getState()

      localStorage.setItem('freshmart-cart', JSON.stringify(state.cart))
      localStorage.setItem('freshmart-favorites', JSON.stringify(state.favorites))
      localStorage.setItem('freshmart-orders', JSON.stringify(state.orders))
    } catch {
      // Ignore localStorage errors
    }
  }, 300)
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer,
    orders: ordersReducer
  },

  preloadedState: {
    cart: loadFromStorage('freshmart-cart') || { items: [] },
    favorites: loadFromStorage('freshmart-favorites') || { items: [] },
    orders: loadFromStorage('freshmart-orders') || { orders: [] }
  }
})

store.subscribe(saveToStorage)
