import { z } from 'zod'
import { LEAD_SOURCES, LEAD_STATUSES } from '../constants.js'

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id')

export const leadBodySchema = z.object({
  name: z.string().trim().min(2, 'Enter the lead’s full name.').max(100),
  email: z.string().trim().toLowerCase().email('Enter a valid email.').max(200),
  phone: z.string().trim().max(40).regex(/^$|^[+\d][\d\s().-]{6,}$/, 'Use digits, spaces, and an optional leading +.').default(''),
  company: z.string().trim().min(1, 'Enter the company name.').max(120),
  source: z.enum(LEAD_SOURCES).default('Website'),
  status: z.enum(LEAD_STATUSES).default('new'),
  notes: z.string().max(500, 'Keep notes under 500 characters.').default(''),
})

export const leadQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  sort: z.enum(['name', 'company', 'source', 'status', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export const bulkStatusSchema = z.object({
  ids: z.array(objectId).min(1).max(200),
  status: z.enum(LEAD_STATUSES),
})

export const bulkDeleteSchema = z.object({ ids: z.array(objectId).min(1).max(200) })

export type LeadBody = z.infer<typeof leadBodySchema>
export type LeadQuery = z.infer<typeof leadQuerySchema>
export type BulkStatusBody = z.infer<typeof bulkStatusSchema>
export type BulkDeleteBody = z.infer<typeof bulkDeleteSchema>
