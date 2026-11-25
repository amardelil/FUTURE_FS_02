import { Schema, model } from 'mongoose'
import { jsonOptions } from './transform.js'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true, toJSON: jsonOptions },
)

export const User = model('User', userSchema)
