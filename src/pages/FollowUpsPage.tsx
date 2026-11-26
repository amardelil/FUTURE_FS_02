import { useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { groupFollowUps, type FollowUpGroup } from '@/lib/leads'
import { FollowUpCard } from '@/components/followups/FollowUpCard'

const TABS: { id: FollowUpGroup; label: string; empty: string }[] = [
  { id: 'upcoming', label: 'Upcoming', empty: 'Nothing scheduled. Open a lead and choose Schedule to add one.' },
  { id: 'overdue', label: 'Overdue', empty: 'No overdue follow-ups.' },
  { id: 'completed', label: 'Completed', empty: 'Completed follow-ups will show up here.' },
]

export function FollowUpsPage() {
  const { followUps, leads, toggleFollowUp, deleteFollowUp } = useCrm()
  const { viewLead } = useUi()
  const [tab, setTab] = useState<FollowUpGroup>('upcoming')
  const groups = groupFollowUps(followUps)
  const current = TABS.find((t) => t.id === tab)!

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Follow-up status" className="flex gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            aria-controls="followup-panel"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${tab === t.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {t.label}
            <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${t.id === 'overdue' && groups.overdue.length ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>{groups[t.id].length}</span>
          </button>
        ))}
      </div>
      <div id="followup-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="space-y-3">
        {groups[tab].length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-14 text-center">
            <CalendarCheck className="size-6 text-slate-400" aria-hidden="true" />
            <p className="text-sm text-slate-500">{current.empty}</p>
          </div>
        ) : groups[tab].map((f) => {
          const lead = leads.find((l) => l.id === f.leadId)
          return (
            <FollowUpCard
              key={f.id}
              followUp={f}
              leadName={lead?.name ?? 'Unknown lead'}
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