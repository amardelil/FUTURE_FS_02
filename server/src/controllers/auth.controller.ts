import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import { currentUserId } from '../middleware/auth.js'
import { User } from '../models/User.js'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js'
import { AppError } from '../utils/AppError.js'
import { signToken } from '../utils/token.js'

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12)

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body as RegisterInput
  if (await User.exists({ email })) throw new AppError(409, 'An account with this email already exists.')

  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) })
  res.status(201).json({ token: signToken(user.id), user })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput
  const user = await User.findOne({ email }).select('+passwordHash')
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
  if (!user || !valid) throw new AppError(401, 'Incorrect email or password.')

  res.json({ token: signToken(user.id), user })
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(currentUserId(req))
  if (!user) throw new AppError(404, 'Account not found.')
  res.json({ user })
}
