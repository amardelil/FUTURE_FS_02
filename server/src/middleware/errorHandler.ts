import type { ErrorRequestHandler, RequestHandler } from 'express'
import mongoose from 'mongoose'
import { ZodError } from 'zod'
import { AppError } from '../utils/AppError.js'

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message, details: err.details })
    return
  }
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Validation failed', details: err.flatten().fieldErrors })
    return
  }
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: 'Invalid id' })
    return
  }
  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({ message: 'That value is already in use.' })
    return
  }
  console.error(err)
  res.status(500).json({ message: 'Something went wrong. Try again.' })
}
