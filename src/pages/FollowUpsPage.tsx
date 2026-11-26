import { useState } from 'react'
import { CalendarCheck, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { groupFollowUps, type FollowUpGroup } from '@/lib/leads'
import { FollowUpCard } from '@/components/followups/FollowUpCard'

const TABS: { id: FollowUpGroup; label: string; icon: any; empty: string }[] = [
  { id: 'upcoming', label: 'Upcoming', icon: Clock, empty: 'You have no upcoming reminders. Click a customer to schedule one.' },
  { id: 'overdue', label: 'Overdue', icon: AlertCircle, empty: 'Excellent! You have no overdue reminders.' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2, empty: 'Reminders you finish will appear here.' },
]

export function FollowUpsPage() {
  const { followUps, leads, toggleFollowUp, deleteFollowUp } = useCrm()
  const { viewLead } = useUi()
  const [tab, setTab] = useState<FollowUpGroup>('upcoming')
  const groups = groupFollowUps(followUps)
  const current = TABS.find((t) => t.id === tab)!

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <CalendarCheck className="size-6 text-indigo-600" /> Reminders
        </h1>
        <p className="text-sm text-slate-500">Never forget a follow-up again. Stay on top of your calls and meetings.</p>
      </div>

      {/* Modern Pill Tabs */}
      <div role="tablist" aria-label="Reminder status" className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          const count = groups[t.id].length
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className={`size-4 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
              {t.label}
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {groups[tab].length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-20 text-center animate-fade-up">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <current.icon className="size-8" />
            </div>
            <p className="max-w-xs text-sm font-medium text-slate-600">{current.empty}</p>
          </div>
        ) : groups[tab].map((f) => {
          const lead = leads.find((l) => l.id === f.leadId)
          return (
            <FollowUpCard
              key={f.id}
              followUp={f}
              leadName={lead?.name ?? 'Unknown customer'}
              onToggle={toggleFollowUp}
              onDelete={deleteFollowUp}
              onOpenLead={() => lead && viewLead(lead.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
