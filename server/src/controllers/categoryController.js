import { Category } from '../models/Category.js'

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body)

    res.status(201).json({
      success: true,
      message: 'Category created',
      category,
    })
  } catch (error) {
    next(error)
  }
}

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    res.status(200).json({ success: true, categories })
  } catch (error) {
    next(error)
  }
}
