import { ArrowLeft, CheckCircle2, Circle, ShoppingBag } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { formatCurrency } from '../utils/format'

const OrderConfirmation = () => {
  const location = useLocation()
  const { orderId: urlOrderId } = useParams()

  const orders = useSelector(state => state.orders.orders)

  const orderId = urlOrderId || location.state?.orderId

  const order = orders.find(item => item.id === orderId)

  const statuses = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered']

  const currentStatusIndex = order ? statuses.indexOf(order.status) : -1

  if (!order) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600'>
            <ShoppingBag className='h-10 w-10' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-900'>No order found</h1>
          <p className='mt-2 text-sm text-gray-500'>We couldn't find the order you're looking for.</p>
          <div className='mt-6 flex flex-col justify-center gap-3 sm:flex-row'>
            <Link to='/my-orders' className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600'>
              <ArrowLeft className='h-4 w-4' />
              My orders
            </Link>
            <Link to='/shop' className='inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700'>
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-gray-50 py-12 sm:py-16 lg:py-20'>
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-6'>
          <Link to='/my-orders' className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-green-600'>
            <ArrowLeft className='h-4 w-4' />
            Back to my orders
          </Link>
        </div>

        <div className='rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600'>
            <CheckCircle2 className='h-12 w-12' />
          </div>
          <p className='mt-6 text-sm font-semibold uppercase tracking-wider text-green-600'>Order confirmed</p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Thank you for your order!</h1>
          <p className='mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base'>
            Your order has been placed successfully. We'll prepare your fresh groceries for delivery.
          </p>
          <div className='mt-8 rounded-2xl bg-gray-50 p-5 text-left'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-xs font-medium uppercase tracking-wider text-gray-400'>Order number</p>
                <p className='mt-1 break-all font-bold text-gray-900'>{order.id}</p>
              </div>
              <div className='sm:text-right'>
                <p className='text-xs font-medium uppercase tracking-wider text-gray-400'>Total</p>
                <p className='mt-1 text-lg font-bold text-green-600'>{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>

          <div className='mt-6 rounded-2xl border border-gray-100 p-5 text-left'>
            <h2 className='text-lg font-bold text-gray-900'>Order status</h2>
            <div className='mt-5 grid gap-4 sm:grid-cols-4'>
              {statuses.map((status, index) => {
                const completed = index <= currentStatusIndex

                return (
                  <div key={status} className='flex items-center gap-2 sm:flex-col sm:items-center sm:text-center'>
                    {completed ? (
                      <CheckCircle2 className='h-5 w-5 shrink-0 text-green-600' />
                    ) : (
                      <Circle className='h-5 w-5 shrink-0 text-gray-300' />
                    )}
                    <span className={`text-sm font-medium ${completed ? 'text-green-600' : 'text-gray-400'}`}>{status}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='mt-6 text-left'>
            <h2 className='text-lg font-bold text-gray-900'>Delivery details</h2>
            <div className='mt-4 rounded-2xl border border-gray-100 p-5'>
              <p className='font-semibold text-gray-900'>{order.customer.fullName}</p>
              <p className='mt-2 text-sm text-gray-500'>{order.customer.address}</p>
              <p className='text-sm text-gray-500'>
                {order.customer.city},{' '}
                {order.customer.postalCode}
              </p>
              <p className='mt-2 text-sm text-gray-500'>{order.customer.phone}</p>
              <p className='text-sm text-gray-500'>{order.customer.email}</p>
            </div>
          </div>

          <div className='mt-6 text-left'>
            <h2 className='text-lg font-bold text-gray-900'>Items ordered</h2>
            <div className='mt-4 space-y-3'>
              {order.items.map(item => (
                <div key={item.id} className='flex items-center gap-3 rounded-xl border border-gray-100 p-3'>
                  <img src={item.image} alt={item.name} className='h-14 w-14 rounded-lg object-cover' />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-gray-900'>{item.name}</p>
                    <p className='mt-1 text-xs text-gray-500'>
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className='text-sm font-semibold text-gray-900'>{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-6 border-t border-gray-100 pt-6 text-left'>
            <div className='space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>Subtotal</span>
                <span className='font-medium text-gray-900'>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>Delivery</span>
                <span className='font-medium text-green-600'>{order.deliveryFee === 0 ? 'FREE' : `${formatCurrency(order.deliveryFee)}`}</span>
              </div>
              <div className='border-t border-gray-100 pt-3'>
                <div className='flex items-center justify-between'>
                  <span className='font-semibold text-gray-900'>Total</span>
                  <span className='text-xl font-bold text-green-600'>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Link to='/my-orders' className='inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600 sm:w-auto sm:px-8'>
              <ShoppingBag className='h-4 w-4' />
              My orders
            </Link>
            <Link to='/shop' className='inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-700 sm:w-auto sm:px-8'>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderConfirmation
