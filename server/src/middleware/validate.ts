import type { RequestHandler } from 'express'
import type { ZodTypeAny } from 'zod'

export const validate =
  (schema: ZodTypeAny, source: 'body' | 'query' = 'body'): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      next(result.error)
      return
    }
    if (source === 'body') req.body = result.data
    else res.locals.query = result.data
    next()
  }
