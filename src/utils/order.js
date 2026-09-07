export const FREE_DELIVERY_THRESHOLD = 50
export const DELIVERY_FEE = 5

export const calculateSubtotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export const calculateDeliveryFee = (subtotal) => {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

export const calculateOrderTotal = (subtotal) => {
  return subtotal + calculateDeliveryFee(subtotal)
}

export const calculateTotalItems = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0)
}
