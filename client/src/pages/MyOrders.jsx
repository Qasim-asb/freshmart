import { CalendarDays, ChevronRight, Package, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { calculateTotalItems } from '../utils/order'
import { formatCurrency, formatDate } from '../utils/format'
import { useGetMyOrdersQuery } from '../features/orders/orderApi'

const MyOrders = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery()

  const orders = data?.orders || []

  if (isLoading) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600'>
            <Package className='h-6 w-6 animate-pulse' />
          </div>
          <p className='mt-4 text-sm font-medium text-gray-500'>Loading your orders...</p>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500'>
            <Package className='h-10 w-10' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-900'>Unable to load orders</h1>
          <p className='mt-2 text-sm text-gray-500'>Something went wrong while loading your orders. Please try again.</p>
        </div>
      </section>
    )
  }

  if (orders.length === 0) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600'>
            <ShoppingBag className='h-10 w-10' />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-900'>No orders yet</h1>
          <p className='mt-2 text-sm text-gray-500'>Your orders will appear here.</p>
          <Link to='/shop' className='mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700'>
            <ShoppingBag className='h-4 w-4' />
            Start shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-gray-50 py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>Your purchases</p>
          <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>My Orders</h1>
          <p className='mt-3 text-sm text-gray-500 sm:text-base'>View and track your previous FreshMart orders.</p>
        </div>

        <div className='mt-8 space-y-4'>
          {orders.map(order => {
            const totalItems = calculateTotalItems(order.items)

            return (
              <div key={order._id} className='rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6'>
                <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
                  <div className='flex min-w-0 items-start gap-4'>
                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600'>
                      <Package className='h-6 w-6' />
                    </div>
                    <div className='min-w-0'>
                      <p className='text-xs font-medium uppercase tracking-wide text-gray-400'>Order</p>
                      <h2 className='mt-1 truncate text-base font-bold text-gray-900 sm:text-lg'>{order.id}</h2>
                      <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500'>
                        <span className='inline-flex items-center gap-1.5'>
                          <CalendarDays className='h-4 w-4' />
                          {formatDate(order.createdAt)}
                        </span>
                        <span>
                          {totalItems}{' '}
                          {totalItems === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end'>
                    <div className='flex items-center justify-between gap-6 sm:block sm:text-right'>
                      <p className='text-xs font-medium uppercase tracking-wide text-gray-400'>Total</p>
                      <p className='mt-1 text-lg font-bold text-green-600'>{formatCurrency(order.total)}</p>
                    </div>
                    <span className='inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700'>{order.status}</span>

                    <Link to={`/order-confirmation/${order._id}`} className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600'>
                      View order
                      <ChevronRight className='h-4 w-4' />
                    </Link>
                  </div>
                </div>

                <div className='mt-5 border-t border-gray-100 pt-5'>
                  <div className='flex gap-3 overflow-x-auto pb-1'>
                    {order.items.slice(0, 5).map(item => (
                      <div key={item.productId} className='flex shrink-0 items-center gap-2 rounded-xl bg-gray-50 px-3 py-2'>
                        <img src={item.image?.url} alt={item.name} className='h-10 w-10 rounded-lg object-cover' />

                        <div className='max-w-32'>
                          <p className='truncate text-xs font-semibold text-gray-800'>{item.name}</p>
                          <p className='text-xs text-gray-500'>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div className='flex shrink-0 items-center rounded-xl bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500'>
                        +{order.items.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className='mt-8 text-center'>
          <Link to='/shop' className='inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition-colors hover:text-green-700'>
            <ShoppingBag className='h-4 w-4' />
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MyOrders
