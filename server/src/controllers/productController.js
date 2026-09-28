import fs from 'fs/promises'
import { ErrorHandler } from '../middleware/errorHandler.js'
import { Product } from '../models/Product.js'
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinaryUpload.js'

const UPDATABLE_FIELDS = ['name', 'category', 'price', 'oldPrice', 'unitValue', 'unit', 'stock']

export const createProduct = async (req, res, next) => {
  try {
    const image = await uploadToCloudinary(req.file.path)
    await fs.unlink(req.file.path)

    const product = await Product.create({ ...req.body, image })

    res.status(201).json({ success: true, message: 'Product created', product })
  } catch (error) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => { })
    next(error)
  }
}

export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query
    const filter = {}

    if (category) filter.category = category

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ]
    }

    const products = await Product.find(filter)

    res.status(200).json({ success: true, products })
  } catch (error) {
    next(error)
  }
}

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler(404, 'Product not found'))

    res.status(200).json({ success: true, product })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler(404, 'Product not found'))

    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined) product[field] = req.body[field]
    }

    if (req.file) {
      const oldPublicId = product.image.public_id

      const image = await uploadToCloudinary(req.file.path)
      product.image = image

      await deleteFromCloudinary(oldPublicId)
      await fs.unlink(req.file.path)
    }

    await product.save()

    res.status(200).json({ success: true, product })
  } catch (error) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => { })
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler(404, 'Product not found'))

    await deleteFromCloudinary(product.image.public_id)
    await product.deleteOne()

    res.status(200).json({ success: true, message: 'Product removed' })
  } catch (error) {
    next(error)
  }
}
