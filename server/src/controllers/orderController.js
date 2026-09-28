import { Cart } from '../models/Cart.js'
import { ErrorHandler } from '../middleware/errorHandler.js'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'

const FREE_DELIVERY_THRESHOLD = 50
const DELIVERY_FEE = 5

export const createOrder = async (req, res, next) => {
  try {
    const { customer } = req.body

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId')

    if (!cart || cart.items.length === 0) return next(new ErrorHandler(400, 'Cart is empty'))

    let subtotal = 0
    const orderItems = []

    for (const item of cart.items) {
      const product = item.productId
      if (!product) continue

      if (product.stock < item.quantity) return next(new ErrorHandler(400, `Insufficient stock for ${product.name}`))

      subtotal += product.price * item.quantity

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
        image: {
          public_id: product.image.public_id,
          url: product.image.url
        }
      })
    }

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    const total = subtotal + deliveryFee

    await Promise.all(
      orderItems.map(item =>
        Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: -item.quantity } }
        )
      )
    )

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      customer,
      status: 'Confirmed'
    })

    cart.items = []
    await cart.save()

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    })
  } catch (error) {
    next(error)
  }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, orders })
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) return next(new ErrorHandler(404, 'Order not found'))

    res.status(200).json({ success: true, order })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!order) return next(new ErrorHandler(404, 'Order not found'))

    res.status(200).json({ success: true, order })
  } catch (error) {
    next(error)
  }
}

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    next(error)
  }
}
