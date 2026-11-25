import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const signToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] })

export function verifyToken(token: string): string {
  const payload = jwt.verify(token, env.JWT_SECRET)
  if (typeof payload === 'string' || !payload.sub) throw new Error('Invalid token payload')
  return payload.sub
}
