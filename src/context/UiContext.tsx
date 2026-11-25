import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lead, RouteId } from '@/types'

const ROUTES: RouteId[] = ['overview', 'leads', 'followups', 'analytics', 'settings']
const readRoute = (): RouteId => {
  const id = window.location.hash.replace('#/', '') as RouteId
  return ROUTES.includes(id) ? id : 'overview'
}

interface UiValue {
  route: RouteId
  navigate: (route: RouteId) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  mobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  globalSearch: string
  setGlobalSearch: (q: string) => void
  leadForm: { open: boolean; lead: Lead | null }
  openLeadForm: (lead?: Lead) => void
  closeLeadForm: () => void
  detailsLeadId: string | null
  viewLead: (id: string | null) => void
  deleteIds: string[] | null
  requestDelete: (ids: string[] | null) => void
  toast: string | null
  showToast: (message: string) => void
}

const UiContext = createContext<UiValue | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<RouteId>(readRoute)
  const [sidebarCollapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [leadForm, setLeadForm] = useState<UiValue['leadForm']>({ open: false, lead: null })
  const [detailsLeadId, viewLead] = useState<string | null>(null)
  const [deleteIds, requestDelete] = useState<string[] | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const onHash = () => { setRoute(readRoute()); setMobileNavOpen(false) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  const navigate = useCallback((r: RouteId) => { window.location.hash = `#/${r}` }, [])
  const toggleSidebar = useCallback(() => setCollapsed((c) => !c), [])
  const openLeadForm = useCallback((lead?: Lead) => setLeadForm({ open: true, lead: lead ?? null }), [])
  const closeLeadForm = useCallback(() => setLeadForm({ open: false, lead: null }), [])

  const value = useMemo<UiValue>(() => ({
    route, navigate, sidebarCollapsed, toggleSidebar, mobileNavOpen, setMobileNavOpen,
    globalSearch, setGlobalSearch, leadForm, openLeadForm, closeLeadForm,
    detailsLeadId, viewLead, deleteIds, requestDelete, toast, showToast: setToast,
  }), [route, navigate, sidebarCollapsed, toggleSidebar, mobileNavOpen, globalSearch, leadForm, openLeadForm, closeLeadForm, detailsLeadId, deleteIds, toast])

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi(): UiValue {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used inside UiProvider')
  return ctx
}
