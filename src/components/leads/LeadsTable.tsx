import { Pencil, Trash2, Eye } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { LeadStatusBadge } from '@/components/ui/Badges'
import { formatDate } from '@/lib/format'
import type { Lead, SortState } from '@/types'

interface Props {
  leads: Lead[]
  onSort: (key: SortState['key']) => void
  selectable?: boolean
  selectedIds?: string[]
  onToggleOne?: (id: string) => void
  onToggleAll?: () => void
  onView: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

export function LeadsTable({
  leads, onSort, selectable, selectedIds = [], onToggleOne, onToggleAll, onView, onEdit, onDelete,
}: Props) {
  const allSelected = leads.length > 0 && leads.every((l) => selectedIds.includes(l.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
              </th>
            )}
            <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900" onClick={() => onSort('name')}>Name</th>
            <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900 hidden md:table-cell" onClick={() => onSort('company')}>Company</th>
            <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900 hidden lg:table-cell" onClick={() => onSort('source')}>Source</th>
            <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900" onClick={() => onSort('status')}>Status</th>
            <th className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900 hidden sm:table-cell" onClick={() => onSort('createdAt')}>Recorded</th>
            <th className="w-16 px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="group transition-colors hover:bg-slate-50/80">
              {selectable && (
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => onToggleOne?.(lead.id)} className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={lead.name} size="sm" />
                  <div>
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-xs text-slate-500 md:hidden">{lead.company}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">{lead.company}</td>
              <td className="px-4 py-3 hidden lg:table-cell text-slate-500">{lead.source}</td>
              <td className="px-4 py-3"><LeadStatusBadge status={lead.status} /></td>
              <td className="px-4 py-3 hidden sm:table-cell text-slate-500">{formatDate(lead.createdAt)}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => onView(lead)} className="rounded p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600" title="View"><Eye className="size-4" /></button>
                  <button onClick={() => onEdit(lead)} className="rounded p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600" title="Edit"><Pencil className="size-4" /></button>
                  <button onClick={() => onDelete(lead)} className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" title="Remove"><Trash2 className="size-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
