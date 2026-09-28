import fs from 'fs/promises'
import { validationResult } from 'express-validator'
import { ErrorHandler } from './errorHandler.js'

export const validate = (validators) => async (req, res, next) => {
  await Promise.all(validators.map(validator => validator.run(req)))

  const result = validationResult(req)
  if (result.isEmpty()) return next()

  if (req.file?.path) {
    await fs.unlink(req.file.path).catch(() => { })
  }

  const errors = result.array().map(err => ({
    field: err.path,
    message: err.msg
  }))

  next(new ErrorHandler(422, 'Validation failed', errors))
}
