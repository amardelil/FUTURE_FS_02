import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useUi } from '@/context/UiContext'
import { api } from '@/lib/api'
import { errorMessage } from '@/lib/errors'
import type { Activity, FollowUp, Lead, LeadFormValues, LeadStatus } from '@/types'
import type { FollowUpInput } from '@/types/api'

interface CrmValue {
  leads: Lead[]
  followUps: FollowUp[]
  activities: Activity[]
  loading: boolean
  loadError: string | null
  reload: () => void
  addLead: (values: LeadFormValues) => Promise<boolean>
  updateLead: (id: string, values: LeadFormValues) => Promise<boolean>
  deleteLeads: (ids: string[]) => Promise<boolean>
  setStatus: (ids: string[], status: LeadStatus) => Promise<boolean>
  addFollowUp: (input: FollowUpInput) => Promise<boolean>
  toggleFollowUp: (id: string) => Promise<boolean>
  deleteFollowUp: (id: string) => Promise<boolean>
}

const CrmContext = createContext<CrmValue | null>(null)

interface Page { data: Lead[]; meta: { totalPages: number } }

async function fetchAllLeads(): Promise<Lead[]> {
  const all: Lead[] = []
  let page = 1
  let totalPages = 1
  do {
    const res = await api.get<Page>(`/leads?limit=100&page=${page}&sort=createdAt&order=desc`)
    all.push(...res.data)
    totalPages = res.meta.totalPages
    page += 1
  } while (page <= totalPages)
  return all
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const { showToast } = useUi()
  const [leads, setLeads] = useState<Lead[]>([])
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const [l, f, a] = await Promise.all([
        fetchAllLeads(),
        api.get<{ data: FollowUp[] }>('/follow-ups'),
        api.get<{ data: Activity[] }>('/activities?limit=100'),
      ])
      setLeads(l)
      setFollowUps(f.data)
      setActivities(a.data)
    } catch (e) {
      setLoadError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const refreshActivities = useCallback(async () => {
    try {
      setActivities((await api.get<{ data: Activity[] }>('/activities?limit=100')).data)
    } catch { /* the timeline refreshes on the next successful action */ }
  }, [])

  const run = useCallback(async (fn: () => Promise<void>): Promise<boolean> => {
    try {
      await fn()
      return true
    } catch (e) {
      showToast(errorMessage(e), 'error')
      return false
    }
  }, [showToast])

  const addLead = useCallback((values: LeadFormValues) => run(async () => {
    const { lead } = await api.post<{ lead: Lead }>('/leads', values)
    setLeads((prev) => [lead, ...prev])
    await refreshActivities()
  }), [run, refreshActivities])

  const updateLead = useCallback((id: string, values: LeadFormValues) => run(async () => {
    const { lead } = await api.put<{ lead: Lead }>(`/leads/${id}`, values)
    setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)))
    await refreshActivities()
  }), [run, refreshActivities])

  const deleteLeads = useCallback((ids: string[]) => run(async () => {
    await api.delete('/leads/bulk', { ids })
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)))
    setFollowUps((prev) => prev.filter((f) => !ids.includes(f.leadId)))
    setActivities((prev) => prev.filter((a) => !ids.includes(a.leadId)))
  }), [run])

  const setStatus = useCallback((ids: string[], status: LeadStatus) => run(async () => {
    await api.patch('/leads/bulk/status', { ids, status })
    const now = new Date().toISOString()
    setLeads((prev) => prev.map((l) => (ids.includes(l.id) ? { ...l, status, updatedAt: now } : l)))
    await refreshActivities()
  }), [run, refreshActivities])

  const addFollowUp = useCallback((input: FollowUpInput) => run(async () => {
    const { followUp } = await api.post<{ followUp: FollowUp }>('/follow-ups', input)
    setFollowUps((prev) => [...prev, followUp])
    await refreshActivities()
  }), [run, refreshActivities])

  const toggleFollowUp = useCallback((id: string) => run(async () => {
    const current = followUps.find((f) => f.id === id)
    if (!current) return
    const { followUp } = await api.patch<{ followUp: FollowUp }>(`/follow-ups/${id}`, { completed: !current.completed })
    setFollowUps((prev) => prev.map((f) => (f.id === id ? followUp : f)))
  }), [run, followUps])

  const deleteFollowUp = useCallback((id: string) => run(async () => {
    await api.delete(`/follow-ups/${id}`)
    setFollowUps((prev) => prev.filter((f) => f.id !== id))
  }), [run])

  const value = useMemo(
    () => ({
      leads, followUps, activities, loading, loadError, reload: () => { void load() },
      addLead, updateLead, deleteLeads, setStatus, addFollowUp, toggleFollowUp, deleteFollowUp,
    }),
    [leads, followUps, activities, loading, loadError, load, addLead, updateLead, deleteLeads, setStatus, addFollowUp, toggleFollowUp, deleteFollowUp],
  )
  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm(): CrmValue {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used inside CrmProvider')
  return ctx
}
