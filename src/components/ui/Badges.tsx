import type { LeadStatus, Priority } from '@/types'
import { statusLabel } from '@/lib/leads'

const STATUS_STYLES: Record<LeadStatus, { badge: string; dot: string }> = {
  new: { badge: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20', dot: 'bg-indigo-500' },
  contacted: { badge: 'bg-amber-50 text-amber-800 ring-amber-600/20', dot: 'bg-amber-500' },
  converted: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500' },
}
export const STATUS_DOT = (s: LeadStatus): string => STATUS_STYLES[s].dot

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status].badge}`}>
      <span className={`size-1.5 rounded-full ${STATUS_STYLES[status].dot}`} aria-hidden="true" />
      {statusLabel(status)}
    </span>
  )
}

const PRIORITY: Record<Priority, { text: string; dot: string; label: string }> = {
  high: { text: 'text-rose-700', dot: 'bg-rose-500', label: 'High priority' },
  medium: { text: 'text-amber-700', dot: 'bg-amber-500', label: 'Medium priority' },
  low: { text: 'text-slate-600', dot: 'bg-slate-400', label: 'Low priority' },
}

export function PriorityIndicator({ priority }: { priority: Priority }) {
  const p = PRIORITY[priority]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${p.text}`}>
      <span className={`size-2 rounded-full ${p.dot}`} aria-hidden="true" />
      {p.label}
    </span>
  )
}
