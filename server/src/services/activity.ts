import type { Types } from 'mongoose'
import type { ActivityType, LeadStatus } from '../constants.js'
import { Activity } from '../models/Activity.js'
import { oid } from '../utils/objectId.js'

export const logActivity = (owner: string, leadId: Types.ObjectId, type: ActivityType, description: string) =>
  Activity.create({ owner: oid(owner), leadId, type, description })

export function statusChangeEvent(
  lead: { name: string; company: string },
  from: LeadStatus,
  to: LeadStatus,
): { type: ActivityType; description: string } {
  if (from !== to && to === 'converted') return { type: 'lead_converted', description: `${lead.name} converted to a customer` }
  if (from !== to && to === 'contacted') return { type: 'lead_contacted', description: `Reached out to ${lead.name} at ${lead.company}` }
  return { type: 'lead_updated', description: `${lead.name}’s details were updated` }
}
