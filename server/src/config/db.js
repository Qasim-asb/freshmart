import mongoose from 'mongoose'
import env from './env.js'

mongoose.connection.on('connected', () => { console.log('Database connected') })
mongoose.connection.on('error', (err) => { console.error('Database error:', err.message) })
mongoose.connection.on('disconnected', () => { console.log('Database disconnected') })

export const connectDB = async () => {
  await mongoose.connect(env.mongoUri, {
    dbName: 'Fresh-Mart',
    serverSelectionTimeoutMS: 5000
  })
}

export const disconnectDB = async () => {
  await mongoose.connection.close()
  console.log('Database connection closed')
}
