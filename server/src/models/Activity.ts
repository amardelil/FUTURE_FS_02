import { Schema, model } from 'mongoose'
import { ACTIVITY_TYPES } from '../constants.js'
import { jsonOptions } from './transform.js'

const activitySchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    description: { type: String, required: true, maxlength: 300 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, toJSON: jsonOptions },
)

activitySchema.index({ owner: 1, createdAt: -1 })

export const Activity = model('Activity', activitySchema)
