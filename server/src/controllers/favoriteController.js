import { ErrorHandler } from '../middleware/errorHandler.js'  // ← was missing!
import { Favorite } from '../models/Favorite.js'
import { Product } from '../models/Product.js'

export const toggleFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params

    const product = await Product.findById(productId)
    if (!product) return next(new ErrorHandler(404, 'Product not found'))

    const existing = await Favorite.findOne({ user: req.user._id, product: productId })

    if (existing) {
      await existing.deleteOne()
      return res.status(200).json({ success: true, message: 'Removed from favorites' })
    }

    await Favorite.create({ user: req.user._id, product: productId })
    return res.status(201).json({ success: true, message: 'Added to favorites', product })
  } catch (error) {
    next(error)
  }
}

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('product')
    res.status(200).json({
      success: true,
      items: favorites.map((f) => f.product),
    })
  } catch (error) {
    next(error)
  }
}

export const clearFavorites = async (req, res, next) => {
  try {
    await Favorite.deleteMany({ user: req.user._id })
    res.status(200).json({ success: true, message: 'All favorites cleared' })
  } catch (error) {
    next(error)
  }
}
