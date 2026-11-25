export type LeadStatus = 'new' | 'contacted' | 'converted'
export type LeadSource = 'Website' | 'Referral' | 'LinkedIn' | 'Cold email' | 'Event' | 'Social media'
export type Priority = 'low' | 'medium' | 'high'
export type ActivityType =
  | 'lead_created'
  | 'lead_contacted'
  | 'followup_scheduled'
  | 'lead_converted'
  | 'lead_updated'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  source: LeadSource
  status: LeadStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export interface FollowUp {
  id: string
  leadId: string
  scheduledAt: string
  notes: string
  priority: Priority
  completed: boolean
}

export interface Activity {
  id: string
  leadId: string
  type: ActivityType
  description: string
  createdAt: string
}

export type LeadFormValues = Pick<Lead, 'name' | 'email' | 'phone' | 'company' | 'source' | 'status' | 'notes'>
export type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>

export type SortKey = 'name' | 'company' | 'source' | 'status' | 'createdAt'
export interface SortState { key: SortKey; direction: 'asc' | 'desc' }

export type RouteId = 'overview' | 'leads' | 'followups' | 'analytics' | 'settings'
