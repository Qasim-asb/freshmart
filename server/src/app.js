import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import env from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import { notFound } from './middleware/notFound.js'
import { errorMiddleware } from './middleware/errorHandler.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

export const app = express()

app.use(cors({
  origin: env.clientUrl,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FreshMart API is running'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/orders', orderRoutes)

app.use(notFound)
app.use(errorMiddleware)
