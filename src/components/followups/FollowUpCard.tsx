import { CalendarClock, Check } from 'lucide-react'
import { PriorityIndicator } from '@/components/ui/Badges'
import { formatDateTime } from '@/lib/format'
import type { FollowUp } from '@/types'

interface Props {
  followUp: FollowUp
  leadName?: string
  compact?: boolean
  onToggle: (id: string) => void
  onOpenLead?: () => void
}

export function FollowUpCard({ followUp, leadName, compact = false, onToggle, onOpenLead }: Props) {
  const overdue = !followUp.completed && Date.parse(followUp.scheduledAt) < Date.now()
  return (
    <div className={`flex items-start gap-3 rounded-lg border bg-white ${compact ? 'p-3' : 'p-4 shadow-sm'} ${overdue ? 'border-rose-200' : 'border-slate-200'}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={followUp.completed}
        aria-label={followUp.completed ? 'Mark as not done' : 'Mark as done'}
        onClick={() => onToggle(followUp.id)}
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border ${followUp.completed ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white hover:border-slate-400'}`}
      >
        {followUp.completed && <Check className="size-3.5" aria-hidden="true" />}
      </button>
      <div className="min-w-0 flex-1">
        {leadName && (
          <button type="button" onClick={onOpenLead} className="text-sm font-medium text-slate-900 hover:text-indigo-700 hover:underline">{leadName}</button>
        )}
        <p className={`text-sm ${followUp.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{followUp.notes}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className={`inline-flex items-center gap-1.5 text-xs ${overdue ? 'font-medium text-rose-700' : 'text-slate-500'}`}>
            <CalendarClock className="size-3.5" aria-hidden="true" />{overdue && 'Overdue · '}{formatDateTime(followUp.scheduledAt)}
          </span>
          <PriorityIndicator priority={followUp.priority} />
        </div>
      </div>
    </div>
  )
}
