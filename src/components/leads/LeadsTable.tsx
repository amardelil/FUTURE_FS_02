import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Pencil, Trash2 } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { LeadStatusBadge } from '@/components/ui/Badges'
import { formatDate } from '@/lib/format'
import type { Lead, SortKey, SortState } from '@/types'

interface LeadsTableProps {
  leads: Lead[]
  sort: SortState
  onSort: (key: SortKey) => void
  selectable?: boolean
  selectedIds?: string[]
  onToggleOne?: (id: string) => void
  onToggleAll?: () => void
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

function SortHeader({ label, k, sort, onSort, className = '' }: { label: string; k: SortKey; sort: SortState; onSort: (k: SortKey) => void; className?: string }) {
  const active = sort.key === k
  const Icon = !active ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown
  return (
    <th scope="col" aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'} className={`px-4 py-2.5 text-left font-medium ${className}`}>
      <button type="button" onClick={() => onSort(k)} className="inline-flex items-center gap-1.5 rounded hover:text-slate-900">
        {label}<Icon className={`size-3.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} aria-hidden="true" />
      </button>
    </th>
  )
}

export function LeadsTable({ leads, sort, onSort, selectable = false, selectedIds = [], onToggleOne, onToggleAll, onView, onEdit, onDelete }: LeadsTableProps) {
  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.includes(l.id))
  const iconBtn = 'rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
          <tr>
            {selectable && (
              <th scope="col" className="w-10 px-4 py-2.5">
                <input type="checkbox" aria-label="Select all leads on this page" checked={allSelected} onChange={onToggleAll} className="size-4 rounded border-slate-300 accent-indigo-600" />
              </th>
            )}
            <SortHeader label="Name" k="name" sort={sort} onSort={onSort} />
            <th scope="col" className="px-4 py-2.5 text-left font-medium">Email</th>
            <SortHeader label="Company" k="company" sort={sort} onSort={onSort} />
            <SortHeader label="Source" k="source" sort={sort} onSort={onSort} />
            <SortHeader label="Status" k="status" sort={sort} onSort={onSort} />
            <SortHeader label="Date added" k="createdAt" sort={sort} onSort={onSort} />
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => {
            const selected = selectedIds.includes(lead.id)
            return (
              <tr key={lead.id} className={selected ? 'bg-indigo-50/40' : 'hover:bg-slate-50'}>
                {selectable && (
                  <td className="px-4 py-2.5">
                    <input type="checkbox" aria-label={`Select ${lead.name}`} checked={selected} onChange={() => onToggleOne?.(lead.id)} className="size-4 rounded border-slate-300 accent-indigo-600" />
                  </td>
                )}
                <td className="px-4 py-2.5">
                  <button type="button" onClick={() => onView(lead)} className="flex items-center gap-2.5 rounded text-left font-medium text-slate-900 hover:text-indigo-700">
                    <Avatar name={lead.name} size="sm" />{lead.name}
                  </button>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{lead.email}</td>
                <td className="px-4 py-2.5 text-slate-600">{lead.company}</td>
                <td className="px-4 py-2.5 text-slate-600">{lead.source}</td>
                <td className="px-4 py-2.5"><LeadStatusBadge status={lead.status} /></td>
                <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex justify-end gap-0.5">
                    <button type="button" className={iconBtn} aria-label={`View ${lead.name}`} onClick={() => onView(lead)}><Eye className="size-4" /></button>
                    <button type="button" className={iconBtn} aria-label={`Edit ${lead.name}`} onClick={() => onEdit(lead)}><Pencil className="size-4" /></button>
                    <button type="button" className={`${iconBtn} hover:text-rose-700`} aria-label={`Delete ${lead.name}`} onClick={() => onDelete(lead)}><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
