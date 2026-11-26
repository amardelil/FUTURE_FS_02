import { CalendarClock, Check, Trash2 } from 'lucide-react'
import { PriorityIndicator } from '@/components/ui/Badges'
import { formatDateTime } from '@/lib/format'
import type { FollowUp } from '@/types'
import { Avatar } from '@/components/ui/Avatar'

interface Props {
  followUp: FollowUp
  leadName?: string
  compact?: boolean
  onToggle: (id: string) => void
  onDelete?: (id: string) => void
  onOpenLead?: () => void
}

export function FollowUpCard({ followUp, leadName, compact = false, onToggle, onDelete, onOpenLead }: Props) {
  const overdue = !followUp.completed && Date.parse(followUp.scheduledAt) < Date.now()
  
  // Determine border color based on priority
  const borderClass = followUp.priority === 'high' ? 'border-l-rose-500' : followUp.priority === 'medium' ? 'border-l-amber-400' : 'border-l-indigo-300'

  return (
    <div className={`group relative flex items-start gap-4 rounded-xl border border-slate-200 bg-white border-l-4 ${borderClass} ${compact ? 'p-3' : 'p-4 shadow-sm hover:shadow-md'} transition-all ${overdue ? 'bg-rose-50/30' : ''}`}>
      
      {/* Custom Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={followUp.completed}
        onClick={() => onToggle(followUp.id)}
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${followUp.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white hover:border-indigo-500 text-transparent hover:text-indigo-200'}`}
      >
        <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          {leadName && (
            <button type="button" onClick={onOpenLead} className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-indigo-700 transition-colors">
              {!compact && <Avatar name={leadName} size="sm" />}
              {leadName}
            </button>
          )}
          <PriorityIndicator priority={followUp.priority} />
        </div>
        
        <p className={`text-sm ${followUp.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
          {followUp.notes || 'No additional notes.'}
        </p>
        
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${overdue && !followUp.completed ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
            <CalendarClock className="size-3.5" aria-hidden="true" />
            {overdue && !followUp.completed && 'Overdue: '}
            {formatDateTime(followUp.scheduledAt)}
          </span>
        </div>
      </div>

      {onDelete && (
        <button type="button" onClick={() => onDelete(followUp.id)} aria-label="Remove reminder" className="opacity-0 group-hover:opacity-100 rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  )
}
