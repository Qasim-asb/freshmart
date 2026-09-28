import { ErrorHandler } from '../middleware/errorHandler.js'
import { Cart } from '../models/Cart.js'
import { Product } from '../models/Product.js'

const productFields = 'name category price oldPrice unitValue unit image stock'

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.productId', productFields)
  if (!cart) cart = await Cart.create({ user: userId, items: [] })
  return cart
}

export const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body
    const quantity = req.body.quantity ?? 1

    const cart = await getCart(req.user._id)
    const product = await Product.findById(productId)

    if (!product) return next(new ErrorHandler(404, 'Product not found'))

    const existingItem = cart.items.find(item => item.productId._id.toString() === productId)

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity

    if (product.stock < newQuantity) return next(new ErrorHandler(400, `Only ${product.stock} in stock`))

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ productId, quantity })
    }

    await cart.save()
    const updatedCart = await getCart(req.user._id)

    res.status(201).json({ success: true, message: 'Added to cart', cart: updatedCart })
  } catch (error) {
    next(error)
  }
}

export const getCartItems = async (req, res, next) => {
  try {
    const cart = await getCart(req.user._id)
    res.status(200).json({ success: true, cart })
  } catch (error) {
    next(error)
  }
}

export const clearCart = async (req, res, next) => {
  try {
    const cart = await getCart(req.user._id)
    cart.items = []
    await cart.save()
    res.status(200).json({ success: true, message: 'Cart cleared', cart })
  } catch (error) {
    next(error)
  }
}

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    const cart = await getCart(req.user._id)

    const item = cart.items.find(item => item.productId._id.toString() === productId)

    if (!item) return next(new ErrorHandler(404, 'Item not in cart'))

    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.productId._id.toString() !== productId)
    } else {
      const product = await Product.findById(productId)
      if (!product) return next(new ErrorHandler(404, 'Product not found'))

      if (quantity > product.stock) return next(new ErrorHandler(400, `Only ${product.stock} in stock`))

      item.quantity = quantity
    }

    await cart.save()
    const updatedCart = await getCart(req.user._id)

    res.status(200).json({ success: true, message: 'Cart updated', cart: updatedCart })
  } catch (error) {
    next(error)
  }
}

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params

    const cart = await getCart(req.user._id)
    cart.items = cart.items.filter(item => item.productId._id.toString() !== productId)

    await cart.save()
    const updatedCart = await getCart(req.user._id)

    res.status(200).json({ success: true, message: 'Item deleted', cart: updatedCart })
  } catch (error) {
    next(error)
  }
}
