import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { mockActivities, mockFollowUps, mockLeads } from '@/data/mock'
import { uid } from '@/lib/format'
import type { Activity, ActivityType, FollowUp, Lead, LeadFormValues, LeadStatus } from '@/types'

interface CrmValue {
  leads: Lead[]
  followUps: FollowUp[]
  activities: Activity[]
  addLead: (values: LeadFormValues) => Lead
  updateLead: (id: string, values: LeadFormValues) => void
  deleteLeads: (ids: string[]) => void
  setStatus: (ids: string[], status: LeadStatus) => void
  toggleFollowUp: (id: string) => void
}

const CrmContext = createContext<CrmValue | null>(null)

/** In-memory store for Phase 1. Data resets on refresh; Phase 3 swaps this for the REST API. */
export function CrmProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [followUps, setFollowUps] = useState<FollowUp[]>(mockFollowUps)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)

  const log = useCallback((leadId: string, type: ActivityType, description: string) => {
    const entry: Activity = { id: uid('act'), leadId, type, description, createdAt: new Date().toISOString() }
    setActivities((prev) => [entry, ...prev])
  }, [])

  const addLead = useCallback((values: LeadFormValues): Lead => {
    const now = new Date().toISOString()
    const lead: Lead = { ...values, id: uid('lead'), createdAt: now, updatedAt: now }
    setLeads((prev) => [lead, ...prev])
    log(lead.id, 'lead_created', `${lead.name} was added as a new lead`)
    return lead
  }, [log])

  const updateLead = useCallback((id: string, values: LeadFormValues) => {
    const previous = leads.find((l) => l.id === id)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...values, updatedAt: new Date().toISOString() } : l)))
    if (!previous) return
    if (previous.status !== values.status && values.status === 'converted') log(id, 'lead_converted', `${values.name} converted to a customer`)
    else if (previous.status !== values.status && values.status === 'contacted') log(id, 'lead_contacted', `Reached out to ${values.name} at ${values.company}`)
    else log(id, 'lead_updated', `${values.name}’s details were updated`)
  }, [leads, log])

  const deleteLeads = useCallback((ids: string[]) => {
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)))
    setFollowUps((prev) => prev.filter((f) => !ids.includes(f.leadId)))
    setActivities((prev) => prev.filter((a) => !ids.includes(a.leadId)))
  }, [])

  const setStatus = useCallback((ids: string[], status: LeadStatus) => {
    const now = new Date().toISOString()
    setLeads((prev) => prev.map((l) => (ids.includes(l.id) ? { ...l, status, updatedAt: now } : l)))
    leads.filter((l) => ids.includes(l.id) && l.status !== status).forEach((l) => {
      if (status === 'converted') log(l.id, 'lead_converted', `${l.name} converted to a customer`)
      else if (status === 'contacted') log(l.id, 'lead_contacted', `Reached out to ${l.name} at ${l.company}`)
      else log(l.id, 'lead_updated', `${l.name} was moved back to New`)
    })
  }, [leads, log])

  const toggleFollowUp = useCallback((id: string) => {
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, completed: !f.completed } : f)))
  }, [])

  const value = useMemo(
    () => ({ leads, followUps, activities, addLead, updateLead, deleteLeads, setStatus, toggleFollowUp }),
    [leads, followUps, activities, addLead, updateLead, deleteLeads, setStatus, toggleFollowUp],
  )
  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm(): CrmValue {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used inside CrmProvider')
  return ctx
}
