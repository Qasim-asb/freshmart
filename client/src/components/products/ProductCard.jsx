import { Heart, Plus, Star } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/format'
import { useAuth } from '../../features/auth/useAuth'
import { useGetFavoritesQuery, useToggleFavoriteMutation } from '../../features/favorites/favoriteApi'
import { useAddToCartMutation } from '../../features/cart/cartApi'

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: favoriteData } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated })
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation()
  const [toggleFavorite, { isLoading: isToggling }] = useToggleFavoriteMutation()

  const favoriteItems = favoriteData?.items || []

  const isFavorite = isAuthenticated ? favoriteItems.some(item => item._id === product._id) : false

  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discount = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    try {
      await addToCart({
        productId: product._id,
        quantity: 1
      }).unwrap()
    } catch (error) {
      console.error('Failed to add product to cart:', error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    try {
      await toggleFavorite(product._id).unwrap()
    } catch (error) {
      console.error('Failed to update favorite:', error)
    }
  }

  return (
    <article className='group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'>
      <div className='relative aspect-square overflow-hidden bg-gray-50'>
        <img src={product.image?.url} alt={product.name} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
        {hasDiscount && <span className='absolute left-3 top-3 rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white'>-{discount}%</span>}

        <button type='button' onClick={handleToggleFavorite} disabled={isAuthenticated && isToggling} className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:bg-green-50 hover:text-green-600'}`}>
          <Heart className='h-4 w-4' fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className='p-4'>
        <p className='text-xs font-medium text-gray-400'>{product.category}</p>
        <h3 className='mt-1 line-clamp-1 font-semibold text-gray-900'>
          <Link to={`/product/${product._id}`} className='transition-colors hover:text-green-600'>
            {product.name}
          </Link>
        </h3>
        <div className='mt-2 flex items-center gap-1'>
          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
          <span className='text-sm font-medium text-gray-700'>4.5</span>
        </div>
        <div className='mt-3 flex items-end justify-between gap-3'>
          <div>
            <span className='text-lg font-bold text-green-600'>{formatCurrency(product.price)}</span>
            {hasDiscount && <span className='ml-2 text-xs text-gray-400 line-through'>{formatCurrency(product.oldPrice)}</span>}
            <p className='mt-0.5 text-xs text-gray-400'>{product.unitValue} {product.unit}</p>
          </div>

          <button type='button' onClick={handleAddToCart} disabled={product.stock <= 0 || isAdding} className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300'>
            <Plus className='h-5 w-5' />
          </button>
        </div>
        {product.stock <= 0 && <p className='mt-2 text-xs font-medium text-red-500'>Out of stock</p>}
      </div>
    </article>
  )
}

export default ProductCard
