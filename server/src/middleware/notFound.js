import { ErrorHandler } from './errorHandler.js'

export const notFound = (req, res, next) => {
  next(new ErrorHandler(404, `Route not found: ${req.originalUrl}`))
}
