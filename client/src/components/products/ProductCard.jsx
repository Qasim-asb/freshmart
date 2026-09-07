import { Heart, Plus, Star } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart } from '../../features/cart/cartSlice'
import { toggleFavorite } from '../../features/favorites/favoritesSlice'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const favoriteItems = useSelector(state => state.favorites.items)

  const isFavorite = favoriteItems.some(item => item.id === product.id)

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)

  const handleAddToCart = () => {
    dispatch(addToCart({ product }))
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product))
  }

  return (
    <article className='group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'>
      <div className='relative aspect-square overflow-hidden bg-gray-50'>
        <img src={product.image} alt={product.name} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
        <span className='absolute left-3 top-3 rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white'>-{discount}%</span>
        <button type='button' onClick={handleToggleFavorite} className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:bg-green-50 hover:text-green-600'}`}>
          <Heart className='h-4 w-4' fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className='p-4'>
        <p className='text-xs font-medium text-gray-400'>{product.category}</p>
        <h3 className='mt-1 line-clamp-1 font-semibold text-gray-900'>
          <Link to={`/product/${product.id}`} className='transition-colors hover:text-green-600'>{product.name}</Link>
        </h3>
        <div className='mt-2 flex items-center gap-1'>
          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
          <span className='text-sm font-medium text-gray-700'>{product.rating}</span>
        </div>
        <div className='mt-3 flex items-end justify-between gap-3'>
          <div>
            <span className='text-lg font-bold text-green-600'>${product.price.toFixed(2)}</span>
            <span className='ml-2 text-xs text-gray-400 line-through'>${product.oldPrice.toFixed(2)}</span>
            <p className='mt-0.5 text-xs text-gray-400'>{product.unit}</p>
          </div>
          <button type='button' onClick={handleAddToCart} className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700'>
            <Plus className='h-5 w-5' />
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
