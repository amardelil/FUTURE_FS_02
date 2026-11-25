import { useEffect, useMemo, useState } from 'react'
import { filterLeads, paginate, sortLeads, type LeadFilters } from '@/lib/leads'
import type { Lead, SortKey, SortState } from '@/types'

export function useLeadTable(leads: Lead[], pageSize: number, initialQuery = '') {
  const [filters, setFilters] = useState<LeadFilters>({ query: initialQuery, status: 'all', source: 'all' })
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', direction: 'desc' })
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => sortLeads(filterLeads(leads, filters), sort), [leads, filters, sort])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  useEffect(() => { if (page !== safePage) setPage(safePage) }, [page, safePage])

  const update = (patch: Partial<LeadFilters>) => { setFilters((f) => ({ ...f, ...patch })); setPage(1) }
  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, direction: s.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }))

  return {
    filters, update, sort, toggleSort, page: safePage, setPage, totalPages,
    total: filtered.length, filtered, rows: paginate(filtered, safePage, pageSize),
    hasFilters: filters.query !== '' || filters.status !== 'all' || filters.source !== 'all',
  }
}
