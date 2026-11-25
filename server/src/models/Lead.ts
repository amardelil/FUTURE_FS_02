import { Schema, model } from 'mongoose'
import { LEAD_SOURCES, LEAD_STATUSES } from '../constants.js'
import { jsonOptions } from './transform.js'

const leadSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 200 },
    phone: { type: String, default: '', trim: true, maxlength: 40 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    source: { type: String, enum: LEAD_SOURCES, default: 'Website' },
    status: { type: String, enum: LEAD_STATUSES, default: 'new' },
    notes: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true, toJSON: jsonOptions },
)

leadSchema.index({ owner: 1, createdAt: -1 })
leadSchema.index({ owner: 1, status: 1 })

export const Lead = model('Lead', leadSchema)
