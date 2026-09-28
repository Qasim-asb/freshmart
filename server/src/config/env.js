import { config } from 'dotenv'

config()

const requiredEnvVariables = ['MONGODB_URI', 'CLIENT_URL', 'JWT_SECRET', 'NODE_ENV', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']

const missingEnvVariables = requiredEnvVariables.filter(name => !process.env[name])

if (missingEnvVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVariables.join(', ')}`)
}

const validNodeEnvironments = ['development', 'production']

if (!validNodeEnvironments.includes(process.env.NODE_ENV)) {
  throw new Error('NODE_ENV must be either development or production')
}

const isProduction = process.env.NODE_ENV === 'production'

const env = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL,
  jwtSecret: process.env.JWT_SECRET,
  cookie: {
    name: 'freshmart-token',
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api'
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
}

export default env
