import { useState } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAddToCartMutation } from '../features/cart/cartApi'
import { useGetProductByIdQuery } from '../features/products/productApi'
import { useAuth } from '../features/auth/useAuth'
import { formatCurrency } from '../utils/format'

const ProductDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { isAuthenticated } = useAuth()

  const [quantity, setQuantity] = useState(1)

  const { data, isLoading, isError } = useGetProductByIdQuery(id)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()

  const product = data?.product

  if (isLoading) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <p className='text-sm text-gray-500'>Loading product...</p>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Product not found</h1>
          <p className='mt-2 text-sm text-gray-500'>The product you are looking for does not exist.</p>
          <Link to='/shop' className='mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700'>
            <ArrowLeft className='h-4 w-4' />
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price

  const discount = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0

  const handleIncrease = () => {
    setQuantity(prev => Math.min(product.stock, prev + 1))
  }

  const handleDecrease = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    try {
      await addToCart({
        productId: product._id,
        quantity
      }).unwrap()
    } catch (error) {
      console.error('Failed to add product to cart:', error)
    }
  }

  const isOutOfStock = product.stock <= 0

  return (
    <section className='bg-gray-50 py-10 sm:py-12 lg:py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Link to='/shop' className='inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-green-600'>
          <ArrowLeft className='h-4 w-4' />
          Back to shop
        </Link>
        <div className='mt-6 grid gap-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10'>
          <div className='relative overflow-hidden rounded-2xl bg-gray-50'>
            <img src={product.image?.url} alt={product.name} className='aspect-square h-full w-full object-cover' />
            {hasDiscount && <span className='absolute left-4 top-4 rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white'>-{discount}%</span>}
          </div>
          <div className='flex flex-col justify-center'>
            <p className='text-sm font-semibold uppercase tracking-wider text-green-600'>{product.category}</p>
            <h1 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>{product.name}</h1>
            <div className='mt-4 flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                <span className='font-semibold text-gray-900'>4.5</span>
              </div>
              <span className='text-sm text-gray-400'>Customer rating</span>
            </div>
            <div className='mt-6 flex items-end gap-3'>
              <span className='text-3xl font-bold text-green-600'>{formatCurrency(product.price)}</span>
              {hasDiscount && <span className='mb-1 text-base text-gray-400 line-through'>{formatCurrency(product.oldPrice)}</span>}
            </div>
            <p className='mt-1 text-sm text-gray-400'>Price per {product.unit}</p>
            <p className='mt-6 max-w-xl text-sm leading-7 text-gray-600 sm:text-base'>
              Enjoy fresh, high-quality {product.name.toLowerCase()}{' '}
              carefully selected for your everyday grocery needs. FreshMart
              brings quality products right to your doorstep.
            </p>

            {isOutOfStock ? (
              <p className='mt-8 text-sm font-semibold text-red-500'>This product is currently out of stock.</p>
            ) : (
              <div className='mt-8 flex flex-col gap-4 sm:flex-row sm:items-center'>
                <div className='flex w-fit items-center rounded-xl border border-gray-200 bg-white'>
                  <button type='button' onClick={handleDecrease} disabled={quantity <= 1 || isAddingToCart} className='p-3 text-gray-500 transition-colors hover:text-green-600 disabled:cursor-not-allowed disabled:text-gray-300'>
                    <Minus className='h-5 w-5' />
                  </button>
                  <span className='min-w-12 text-center font-semibold text-gray-900'>{quantity}</span>
                  <button type='button' onClick={handleIncrease} disabled={quantity >= product.stock || isAddingToCart} className='p-3 text-gray-500 transition-colors hover:text-green-600 disabled:cursor-not-allowed disabled:text-gray-300'>
                    <Plus className='h-5 w-5' />
                  </button>
                </div>
                <button type='button' onClick={handleAddToCart} disabled={isAddingToCart} className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60'>
                  <ShoppingCart className='h-5 w-5' />
                  {isAddingToCart ? 'Adding...' : `Add ${quantity} to cart`}
                </button>
              </div>
            )}

            {!isOutOfStock && <p className='mt-3 text-xs text-gray-400'>{product.stock} available</p>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
