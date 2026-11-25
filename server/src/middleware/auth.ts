import type { Request, RequestHandler } from 'express'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { verifyToken } from '../utils/token.js'

export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) throw new AppError(401, 'Sign in to continue.')

  let userId: string
  try {
    userId = verifyToken(header.slice(7))
  } catch {
    throw new AppError(401, 'Your session has expired. Sign in again.')
  }

  if (!(await User.exists({ _id: userId }))) throw new AppError(401, 'Your session has expired. Sign in again.')
  req.userId = userId
  next()
})

export function currentUserId(req: Request): string {
  if (!req.userId) throw new AppError(401, 'Sign in to continue.')
  return req.userId
}
