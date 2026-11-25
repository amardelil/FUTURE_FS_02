export const LEAD_STATUSES = ['new', 'contacted', 'converted'] as const
export const LEAD_SOURCES = ['Website', 'Referral', 'LinkedIn', 'Cold email', 'Event', 'Social media'] as const
export const PRIORITIES = ['low', 'medium', 'high'] as const
export const ACTIVITY_TYPES = ['lead_created', 'lead_contacted', 'followup_scheduled', 'lead_converted', 'lead_updated'] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]
export type LeadSource = (typeof LEAD_SOURCES)[number]
export type Priority = (typeof PRIORITIES)[number]
export type ActivityType = (typeof ACTIVITY_TYPES)[number]
