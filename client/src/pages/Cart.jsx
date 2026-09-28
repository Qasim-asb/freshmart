import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useClearCartMutation, useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from '../features/cart/cartApi'
import { calculateDeliveryFee, calculateOrderTotal, calculateSubtotal, calculateTotalItems, FREE_DELIVERY_THRESHOLD } from '../utils/order'
import { formatCurrency } from '../utils/format'

const Cart = () => {
  const { data, isLoading, isError } = useGetCartQuery()

  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation()
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation()
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation()

  const cartItems = data?.cart?.items || []

  const items = cartItems.map(item => ({
    ...item.productId,
    quantity: item.quantity
  }))

  const subtotal = calculateSubtotal(items)

  const deliveryFee = calculateDeliveryFee(subtotal)

  const amountUntilFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)

  const deliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)

  const orderTotal = calculateOrderTotal(subtotal)

  const totalItems = calculateTotalItems(items)

  const isBusy = isUpdating || isRemoving || isClearing

  const handleIncrease = (productId, quantity) => {
    updateCartItem({
      productId,
      quantity: quantity + 1
    })
  }

  const handleDecrease = (productId, quantity) => {
    updateCartItem({
      productId,
      quantity: quantity - 1
    })
  }

  const handleRemove = (productId) => {
    removeFromCart(productId)
  }

  const handleClear = () => {
    clearCart()
  }

  if (isLoading) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <p className='text-sm text-gray-500'>Loading your cart...</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Unable to load your cart</h1>
          <p className='mt-2 text-sm text-gray-500'>
            Please try again in a moment.
          </p>
        </div>
      </section>
    )
  }

  if (cartItems.length === 0) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600'>
            <ShoppingCart className='h-10 w-10' />
          </div>

          <h1 className='mt-6 text-2xl font-bold text-gray-900'>
            Your cart is empty
          </h1>

          <p className='mt-2 text-sm text-gray-500'>
            Add some fresh groceries to get started.
          </p>

          <Link
            to='/shop'
            className='mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700'
          >
            Start shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-gray-50 py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Your shopping cart</p>
            <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Shopping Cart</h1>
            <p className='mt-2 text-sm text-gray-500'>
              {totalItems}{' '}
              {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Link to='/shop' className='rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600'>
              Continue shopping
            </Link>
            <button type='button' onClick={handleClear} disabled={isBusy} className='rounded-lg border border-red-100 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50'>
              {isClearing ? 'Clearing...' : 'Clear cart'}
            </button>
          </div>
        </div>

        <div className='mt-8 grid gap-8 lg:grid-cols-[1fr_360px]'>
          <div className='space-y-4'>
            {cartItems.map(item => {
              const product = item.productId
              const productId = product._id

              return (
                <div key={productId} className='flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center'>
                  <div className='h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50'>
                    <img src={product.image?.url} alt={product.name} className='h-full w-full object-cover' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-medium text-gray-400'>{product.category}</p>
                    <h2 className='mt-1 font-semibold text-gray-900'>{product.name}</h2>
                    <p className='mt-1 text-sm font-semibold text-green-600'>{formatCurrency(product.price)} / {product.unit}</p>
                  </div>
                  <div className='flex items-center justify-between gap-4 sm:justify-end'>
                    <div className='flex items-center rounded-lg border border-gray-200'>
                      <button type='button' onClick={() => handleDecrease(productId, item.quantity)} disabled={isBusy || item.quantity <= 1} className='p-2 text-gray-500 transition-colors hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50'>
                        <Minus className='h-4 w-4' />
                      </button>
                      <span className='min-w-8 text-center text-sm font-semibold text-gray-900'>{item.quantity}</span>
                      <button type='button' onClick={() => handleIncrease(productId, item.quantity)} disabled={isBusy || item.quantity >= product.stock} className='p-2 text-gray-500 transition-colors hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50'>
                        <Plus className='h-4 w-4' />
                      </button>
                    </div>
                    <p className='w-20 text-right font-bold text-gray-900'>{formatCurrency(product.price * item.quantity)}</p>
                    <button type='button' onClick={() => handleRemove(productId)} disabled={isBusy} className='rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'>
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <aside className='h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-bold text-gray-900'>Order summary</h2>

            {subtotal < FREE_DELIVERY_THRESHOLD ? (
              <div className='mt-5 rounded-xl bg-green-50 p-4'>
                <p className='text-sm font-medium text-green-700'>
                  🚚 Add {formatCurrency(amountUntilFreeDelivery)} more for free delivery
                </p>
                <div className='mt-3 h-2 overflow-hidden rounded-full bg-green-100'>
                  <div className='h-full rounded-full bg-green-600 transition-all duration-300' style={{ width: `${deliveryProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className='mt-5 rounded-xl bg-green-50 p-4'>
                <p className='text-sm font-semibold text-green-700'>✓ You've unlocked FREE delivery!</p>
                <div className='mt-3 h-2 overflow-hidden rounded-full bg-green-100'>
                  <div className='h-full w-full rounded-full bg-green-600' />
                </div>
              </div>
            )}

            <div className='mt-6 space-y-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>Items</span>
                <span className='font-medium text-gray-900'>{totalItems}</span>
              </div>

              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>Subtotal</span>
                <span className='font-medium text-gray-900'>{formatCurrency(subtotal)}</span>
              </div>

              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>Delivery</span>
                {deliveryFee === 0 ? (
                  <span className='font-semibold text-green-600'>FREE</span>
                ) : (
                  <span className='font-medium text-gray-900'>{formatCurrency(deliveryFee)}</span>
                )}
              </div>

              <div className='border-t border-gray-100 pt-4'>
                <div className='flex items-center justify-between'>
                  <span className='font-semibold text-gray-900'>Total</span>
                  <span className='text-xl font-bold text-green-600'>{formatCurrency(orderTotal)}</span>
                </div>
              </div>
            </div>

            <Link to='/checkout' className='mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-700'>
              Proceed to checkout
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Cart
