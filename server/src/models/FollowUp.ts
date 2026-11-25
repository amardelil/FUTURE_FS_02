import { Schema, model } from 'mongoose'
import { PRIORITIES } from '../constants.js'
import { jsonOptions } from './transform.js'

const followUpSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    scheduledAt: { type: Date, required: true },
    notes: { type: String, default: '', maxlength: 500 },
    priority: { type: String, enum: PRIORITIES, default: 'medium' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: jsonOptions },
)

followUpSchema.index({ owner: 1, scheduledAt: 1 })

export const FollowUp = model('FollowUp', followUpSchema)
