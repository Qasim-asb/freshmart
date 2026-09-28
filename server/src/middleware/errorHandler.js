export class ErrorHandler extends Error {
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
  }
}

export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  const payload = { success: false, message }
  if (err.errors?.length) payload.errors = err.errors

  res.status(statusCode).json(payload)
}
