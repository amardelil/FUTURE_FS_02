import type { Activity, FollowUp, Lead, LeadSource, LeadStatus, SortState } from '@/types'
import { STATUS_LABEL } from './copy'

export const SOURCES: LeadSource[] = ['Website', 'Referral', 'LinkedIn', 'Cold email', 'Event', 'Social media']
export const STATUSES: { value: LeadStatus; label: string }[] = (['new', 'contacted', 'converted'] as const).map((value) => ({
  value,
  label: STATUS_LABEL[value],
}))
export const statusLabel = (s: LeadStatus): string => STATUS_LABEL[s]

export interface LeadFilters { query: string; status: LeadStatus | 'all'; source: LeadSource | 'all' }

export function filterLeads(leads: Lead[], { query, status, source }: LeadFilters): Lead[] {
  const q = query.trim().toLowerCase()
  return leads.filter(
    (l) =>
      (status === 'all' || l.status === status) &&
      (source === 'all' || l.source === source) &&
      (!q || [l.name, l.email, l.company].some((v) => v.toLowerCase().includes(q))),
  )
}

export function sortLeads(leads: Lead[], { key, direction }: SortState): Lead[] {
  const dir = direction === 'asc' ? 1 : -1
  return [...leads].sort((a, b) => a[key].localeCompare(b[key]) * dir)
}

export const paginate = <T,>(items: T[], page: number, pageSize: number): T[] =>
  items.slice((page - 1) * pageSize, page * pageSize)

export const countByStatus = (leads: Lead[]): Record<LeadStatus, number> => ({
  new: leads.filter((l) => l.status === 'new').length,
  contacted: leads.filter((l) => l.status === 'contacted').length,
  converted: leads.filter((l) => l.status === 'converted').length,
})

export const conversionRate = (leads: Lead[]): number =>
  leads.length ? (leads.filter((l) => l.status === 'converted').length / leads.length) * 100 : 0

export const sourceBreakdown = (leads: Lead[]): { label: string; value: number }[] =>
  SOURCES.map((s) => ({ label: s, value: leads.filter((l) => l.source === s).length })).sort((a, b) => b.value - a.value)

export function monthlyGrowth(leads: Lead[], months = 6): { label: string; value: number }[] {
  const now = new Date()
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)
    const value = leads.filter((l) => {
      const c = new Date(l.createdAt)
      return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth()
    }).length
    return { label: d.toLocaleDateString('en-US', { month: 'short' }), value }
  })
}

export type FollowUpGroup = 'upcoming' | 'overdue' | 'completed'
export function groupFollowUps(items: FollowUp[]): Record<FollowUpGroup, FollowUp[]> {
  const now = Date.now()
  const byDate = (a: FollowUp, b: FollowUp) => a.scheduledAt.localeCompare(b.scheduledAt)
  return {
    upcoming: items.filter((f) => !f.completed && Date.parse(f.scheduledAt) >= now).sort(byDate),
    overdue: items.filter((f) => !f.completed && Date.parse(f.scheduledAt) < now).sort(byDate),
    completed: items.filter((f) => f.completed).sort((a, b) => byDate(b, a)),
  }
}

export const activitiesForLead = (items: Activity[], leadId: string): Activity[] => items.filter((a) => a.leadId === leadId)
