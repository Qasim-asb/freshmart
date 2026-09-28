import { useState } from 'react'
import { ArrowLeft, CheckCircle2, MapPin, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { calculateDeliveryFee, calculateOrderTotal, calculateSubtotal, calculateTotalItems } from '../utils/order'
import { formatCurrency } from '../utils/format'
import FormInput from '../components/ui/FormInput'
import { useGetCartQuery } from '../features/cart/cartApi'
import { useCreateOrderMutation } from '../features/orders/orderApi'

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  })

  const [errors, setErrors] = useState({})
  const [orderError, setOrderError] = useState('')

  const navigate = useNavigate()

  const { data, isLoading, isError, refetch } = useGetCartQuery()
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation()

  const cartItems = (data?.cart?.items || []).map(item => ({
    ...item.productId,
    quantity: item.quantity
  }))

  const subtotal = calculateSubtotal(cartItems)
  const deliveryFee = calculateDeliveryFee(subtotal)
  const orderTotal = calculateOrderTotal(subtotal)
  const totalItems = calculateTotalItems(cartItems)

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData(currentData => ({ ...currentData, [name]: value }))

    if (errors[name]) {
      setErrors(currentErrors => ({ ...currentErrors, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setOrderError('')

    try {
      const response = await createOrder(formData).unwrap()
      const order = response?.order

      if (!order?._id) {
        throw new Error('Order was created but no order ID was returned.')
      }
      navigate(`/order-confirmation/${order._id}`, { replace: true })
    } catch (err) {
      setOrderError(
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        'Failed to place order. Please try again.'
      )
    }
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
          <h1 className='text-2xl font-bold text-gray-900'>Unable to load checkout</h1>
          <p className='mt-2 text-sm text-gray-500'>Please try again in a moment.</p>
          <button type='button' onClick={refetch} className='mt-6 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700'>
            Try again
          </button>
        </div>
      </section>
    )
  }

  if (cartItems.length === 0) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600'>
            <ShoppingBag className='h-10 w-10' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-900'>Your cart is empty</h1>
          <p className='mt-2 text-sm text-gray-500'>Add some products before proceeding to checkout.</p>
          <Link to='/shop' className='mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700'>
            <ArrowLeft className='h-4 w-4' />
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-gray-50 py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Link to='/cart' className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-green-600'>
          <ArrowLeft className='h-4 w-4' />
          Back to cart
        </Link>

        <div className='mt-6'>
          <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Secure checkout</p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Complete your order</h1>
          <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base'>
            Enter your delivery information and review your order before placing it.
          </p>
        </div>

        <div className='mt-8 grid gap-8 lg:grid-cols-[1fr_380px]'>
          <div className='space-y-6'>
            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600'>
                  <CheckCircle2 className='h-5 w-5' />
                </div>
                <div>
                  <h2 className='font-bold text-gray-900'>Customer information</h2>
                  <p className='text-sm text-gray-500'>Tell us where we should deliver your order.</p>
                </div>
              </div>

              <div className='mt-6 grid gap-5 sm:grid-cols-2'>
                <FormInput label='Full name' name='fullName' type='text' value={formData.fullName} onChange={handleInputChange} placeholder='Enter your name' error={errors.fullName} devSpan='sm:col-span-2' className='mt-2' />
                <FormInput label='Email address' name='email' type='email' value={formData.email} onChange={handleInputChange} placeholder='Enter your email' error={errors.email} className='mt-2' />
                <FormInput label='Phone number' name='phone' type='tel' value={formData.phone} onChange={handleInputChange} placeholder='+923407852942' error={errors.phone} className='mt-2' />
              </div>
            </div>

            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600'>
                  <MapPin className='h-5 w-5' />
                </div>
                <div>
                  <h2 className='font-bold text-gray-900'>Delivery address</h2>
                  <p className='text-sm text-gray-500'>Where should we deliver your groceries?</p>
                </div>
              </div>

              <div className='mt-6 space-y-5'>
                <FormInput label='Street address' name='address' type='text' value={formData.address} onChange={handleInputChange} placeholder='123 Main Street' error={errors.address} className='mt-2' />

                <div className='grid gap-5 sm:grid-cols-2'>
                  <FormInput label='City' name='city' type='text' value={formData.city} onChange={handleInputChange} placeholder='Attock' error={errors.city} className='mt-2' />
                  <FormInput label='Postal code' name='postalCode' type='text' value={formData.postalCode} onChange={handleInputChange} placeholder='10001' error={errors.postalCode} className='mt-2' />
                </div>
              </div>
            </div>
          </div>

          <aside className='h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-bold text-gray-900'>Order summary</h2>
            <div className='mt-6 space-y-4'>
              {cartItems.map(item => (
                <div key={item._id} className='flex items-center gap-3'>
                  <div className='h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50'>
                    <img src={item.image?.url} alt={item.name} className='h-full w-full object-cover' />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-gray-900'>{item.name}</p>
                    <p className='mt-0.5 text-xs text-gray-500'>{item.quantity} × {formatCurrency(item.price)}</p>
                  </div>

                  <p className='text-sm font-semibold text-gray-900'>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className='mt-6 space-y-4 border-t border-gray-100 pt-6'>
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
                <span className='font-semibold text-green-600'>
                  {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                </span>
              </div>

              <div className='border-t border-gray-100 pt-4'>
                <div className='flex items-center justify-between'>
                  <span className='font-semibold text-gray-900'>Total</span>
                  <span className='text-xl font-bold text-green-600'>{formatCurrency(orderTotal)}</span>
                </div>
              </div>
            </div>

            {orderError && <div className='mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600'>{orderError}</div>}

            <button type='button' onClick={handlePlaceOrder} disabled={isPlacingOrder} className='mt-6 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'>
              {isPlacingOrder ? 'Placing order...' : 'Place order'}
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Checkout
