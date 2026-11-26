import { useState } from 'react'
import { CheckCircle2, MessageSquare, SearchX, Trash2, X, Plus } from 'lucide-react'
import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { useLeadTable } from '@/hooks/useLeadTable'
import { SOURCES, STATUSES } from '@/lib/leads'
import { Button } from '@/components/ui/Button'
import { FilterDropdown } from '@/components/ui/FilterDropdown'
import { Pagination } from '@/components/ui/Pagination'
import { SearchBar } from '@/components/ui/SearchBar'
import { LeadsTable } from './LeadsTable'
import type { LeadSource, LeadStatus } from '@/types'
import { EMPTY } from '@/lib/copy'

interface Props { title?: string; pageSize: number; bulk?: boolean; initialQuery?: string }

export function LeadsExplorer({ title, pageSize, bulk = false, initialQuery = '' }: Props) {
  const { leads, setStatus } = useCrm()
  const ui = useUi()
  const table = useLeadTable(leads, pageSize, initialQuery)
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const live = selected.filter((id) => leads.some((l) => l.id === id))

  const toggleOne = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const toggleAll = () => {
    const ids = table.rows.map((l) => l.id)
    setSelected((s) => (ids.every((id) => s.includes(id)) ? s.filter((id) => !ids.includes(id)) : [...new Set([...s, ...ids])]))
  }
  const bulkStatus = async (status: LeadStatus) => {
    setBusy(true)
    const ok = await setStatus(live, status)
    setBusy(false)
    if (!ok) return
    ui.showToast(`${live.length} ${live.length === 1 ? 'customer' : 'customers'} marked as ${status}.`)
    setSelected([])
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden" aria-label={title ?? 'Customers'}>
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center bg-slate-50/50">
        {title && <h2 className="text-lg font-semibold text-slate-900 lg:mr-auto">{title}</h2>}
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar label="Search by name, email, or company" placeholder="Search customers..." value={table.filters.query} onChange={(query) => table.update({ query })} className="w-full sm:w-64" />
          <FilterDropdown<LeadStatus> label="Filter by status" allLabel="All levels" value={table.filters.status} options={STATUSES} onChange={(status) => table.update({ status })} />
          <FilterDropdown<LeadSource> label="Filter by source" allLabel="All sources" value={table.filters.source} options={SOURCES.map((s) => ({ value: s, label: s }))} onChange={(source) => table.update({ source })} />
        </div>
      </div>

      {bulk && live.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm backdrop-blur-sm" role="region" aria-label="Bulk actions">
          <span className="font-medium text-indigo-900 bg-indigo-200/50 px-2 py-0.5 rounded-full mr-2">{live.length} selected</span>
          <Button className="h-8 bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50" disabled={busy} onClick={() => bulkStatus('contacted')}><MessageSquare className="size-3.5 mr-1" />Mark Contacted</Button>
          <Button className="h-8 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50" disabled={busy} onClick={() => bulkStatus('converted')}><CheckCircle2 className="size-3.5 mr-1" />Mark Closed</Button>
          <Button className="h-8 bg-white border-rose-200 text-rose-700 hover:bg-rose-50" disabled={busy} onClick={() => ui.requestDelete(live)}><Trash2 className="size-3.5 mr-1" />Remove</Button>
          <button type="button" onClick={() => setSelected([])} className="ml-auto inline-flex items-center gap-1 rounded text-indigo-700 hover:underline font-medium"><X className="size-3.5" />Clear</button>
        </div>
      )}

      {table.total === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-20 text-center animate-fade-up">
          <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <SearchX className="size-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{table.hasFilters ? 'No customers match these filters' : EMPTY.customers.title}</p>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">{table.hasFilters ? EMPTY.search.body : EMPTY.customers.body}</p>
          </div>
          {table.hasFilters
            ? <Button className="mt-2" onClick={() => table.update({ query: '', status: 'all', source: 'all' })}>Clear filters</Button>
            : <Button variant="primary" className="mt-2 shadow-sm" onClick={() => ui.openLeadForm()}><Plus className="size-4 mr-2" />{EMPTY.customers.action}</Button>}
        </div>
      ) : (
        <>
          <LeadsTable
            leads={table.rows}
            onSort={table.toggleSort}
            selectable={bulk}
            selectedIds={live}
            onToggleOne={toggleOne}
            onToggleAll={toggleAll}
            onView={(l) => ui.viewLead(l.id)}
            onEdit={(l) => ui.openLeadForm(l)}
            onDelete={(l) => ui.requestDelete([l.id])}
          />
          <Pagination page={table.page} totalPages={table.totalPages} total={table.total} pageSize={pageSize} onChange={table.setPage} />
        </>
      )}
    </section>
  )
}
