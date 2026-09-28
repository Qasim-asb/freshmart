import env from './config/env.js'
import { app } from './app.js'
import { connectDB, disconnectDB } from './config/db.js'

let server
let isShuttingDown = false

const startServer = async () => {
  try {
    await connectDB()
    server = app.listen(env.port, () => {
      console.log(`FreshMart server running on http://localhost:${env.port}`)
    })
  } catch (err) {
    console.error('Server failed to start:', err)
    process.exit(1)
  }
}

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return

  isShuttingDown = true

  console.log(`${signal} received. Shutting down gracefully...`)

  if (server) {
    await new Promise(resolve => {
      server.close(() => {
        console.log('HTTP server closed')
        resolve()
      })
    })
  }

  try {
    await disconnectDB()
  } catch (err) {
    console.error('Failed to close MongoDB connection:', err)
  }

  console.log('Process terminated cleanly')
  process.exit(0)
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  gracefulShutdown('uncaughtException')
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  gracefulShutdown('unhandledRejection')
})

startServer()
