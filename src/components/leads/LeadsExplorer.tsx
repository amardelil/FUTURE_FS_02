import { useState } from 'react'
import { CheckCircle2, MessageSquare, SearchX, Trash2, X } from 'lucide-react'
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

interface Props { title?: string; pageSize: number; bulk?: boolean; initialQuery?: string }

/** Filters + table + pagination, shared by the Overview and Leads pages. */
export function LeadsExplorer({ title, pageSize, bulk = false, initialQuery = '' }: Props) {
  const { leads, setStatus } = useCrm()
  const ui = useUi()
  const table = useLeadTable(leads, pageSize, initialQuery)
  const [selected, setSelected] = useState<string[]>([])
  const live = selected.filter((id) => leads.some((l) => l.id === id))

  const toggleOne = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const toggleAll = () => {
    const ids = table.rows.map((l) => l.id)
    setSelected((s) => (ids.every((id) => s.includes(id)) ? s.filter((id) => !ids.includes(id)) : [...new Set([...s, ...ids])]))
  }
  const bulkStatus = (status: LeadStatus) => {
    setStatus(live, status)
    ui.showToast(`${live.length} lead${live.length === 1 ? '' : 's'} marked as ${status}`)
    setSelected([])
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm" aria-label={title ?? 'Leads'}>
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
        {title && <h2 className="text-sm font-semibold text-slate-900 lg:mr-auto">{title}</h2>}
        <div className="flex flex-wrap items-center gap-2">
          <SearchBar label="Search by name, email, or company" placeholder="Name, email, or company" value={table.filters.query} onChange={(query) => table.update({ query })} className="w-full sm:w-64" />
          <FilterDropdown<LeadStatus> label="Filter by status" allLabel="All statuses" value={table.filters.status} options={STATUSES} onChange={(status) => table.update({ status })} />
          <FilterDropdown<LeadSource> label="Filter by source" allLabel="All sources" value={table.filters.source} options={SOURCES.map((s) => ({ value: s, label: s }))} onChange={(source) => table.update({ source })} />
        </div>
      </div>

      {bulk && live.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50 px-4 py-2 text-sm" role="region" aria-label="Bulk actions">
          <span className="font-medium text-indigo-900">{live.length} selected</span>
          <Button className="h-8" onClick={() => bulkStatus('contacted')}><MessageSquare className="size-3.5" />Mark contacted</Button>
          <Button className="h-8" onClick={() => bulkStatus('converted')}><CheckCircle2 className="size-3.5" />Mark converted</Button>
          <Button className="h-8 text-rose-700" onClick={() => ui.requestDelete(live)}><Trash2 className="size-3.5" />Delete</Button>
          <button type="button" onClick={() => setSelected([])} className="ml-auto inline-flex items-center gap-1 rounded text-indigo-800 hover:underline"><X className="size-3.5" />Clear</button>
        </div>
      )}

      {table.total === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
          <SearchX className="size-6 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-900">{table.hasFilters ? 'No leads match these filters' : 'No leads yet'}</p>
          <p className="text-sm text-slate-500">{table.hasFilters ? 'Try a different search or clear the filters.' : 'Add your first lead to start tracking your pipeline.'}</p>
          {table.hasFilters
            ? <Button onClick={() => table.update({ query: '', status: 'all', source: 'all' })}>Clear filters</Button>
            : <Button variant="primary" onClick={() => ui.openLeadForm()}>Add lead</Button>}
        </div>
      ) : (
        <>
          <LeadsTable
            leads={table.rows}
            sort={table.sort}
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
