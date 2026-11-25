import { CalendarClock, CheckCircle2, MessageSquare, Pencil, UserPlus, type LucideIcon } from 'lucide-react'
import { timeAgo } from '@/lib/format'
import type { Activity, ActivityType } from '@/types'

const ICONS: Record<ActivityType, { icon: LucideIcon; style: string }> = {
  lead_created: { icon: UserPlus, style: 'bg-indigo-50 text-indigo-600' },
  lead_contacted: { icon: MessageSquare, style: 'bg-amber-50 text-amber-700' },
  followup_scheduled: { icon: CalendarClock, style: 'bg-slate-100 text-slate-600' },
  lead_converted: { icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700' },
  lead_updated: { icon: Pencil, style: 'bg-slate-100 text-slate-600' },
}

interface Props { activities: Activity[]; limit?: number; emptyText?: string }

export function ActivityTimeline({ activities, limit, emptyText = 'No recent activity.' }: Props) {
  const items = limit ? activities.slice(0, limit) : activities
  if (items.length === 0) return <p className="text-sm text-slate-500">{emptyText}</p>
  return (
    <ol className="relative space-y-4">
      {items.map((a, i) => {
        const { icon: Icon, style } = ICONS[a.type]
        return (
          <li key={a.id} className="relative flex gap-3">
            {i < items.length - 1 && <span className="absolute left-3.5 top-8 -bottom-4 w-px bg-slate-200" aria-hidden="true" />}
            <span className={`z-10 flex size-7 shrink-0 items-center justify-center rounded-full ${style}`}><Icon className="size-3.5" aria-hidden="true" /></span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm text-slate-700">{a.description}</p>
              <p className="text-xs text-slate-400">{timeAgo(a.createdAt)}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
