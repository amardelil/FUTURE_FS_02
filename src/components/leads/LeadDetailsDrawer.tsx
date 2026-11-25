import type { ReactNode } from 'react'
import { Building2, Mail, Pencil, Phone, Trash2, Tag } from 'lucide-react'
import { Overlay } from '@/components/ui/Overlay'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { LeadStatusBadge } from '@/components/ui/Badges'
import { ActivityTimeline } from '@/components/activity/ActivityTimeline'
import { FollowUpCard } from '@/components/followups/FollowUpCard'
import { useCrm } from '@/context/CrmContext'
import { formatDate } from '@/lib/format'
import type { Activity, FollowUp, Lead } from '@/types'

interface Props {
  lead: Lead | null
  followUps: FollowUp[]
  activities: Activity[]
  onClose: () => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-slate-100 py-4 first:border-0 first:pt-0">
    <h3 className="mb-2 text-sm font-semibold text-slate-900">{title}</h3>
    {children}
  </section>
)

export function LeadDetailsDrawer({ lead, followUps, activities, onClose, onEdit, onDelete }: Props) {
  const { toggleFollowUp } = useCrm()
  return (
    <Overlay
      open={lead !== null}
      onClose={onClose}
      title="Lead details"
      variant="drawer"
      footer={lead && <><Button variant="ghost" className="mr-auto text-rose-700 hover:bg-rose-50" onClick={() => onDelete(lead)}><Trash2 className="size-4" />Delete</Button><Button variant="primary" onClick={() => onEdit(lead)}><Pencil className="size-4" />Edit lead</Button></>}
    >
      {lead && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={lead.name} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">{lead.name}</p>
              <p className="truncate text-sm text-slate-500">{lead.company}</p>
            </div>
            <div className="ml-auto"><LeadStatusBadge status={lead.status} /></div>
          </div>
          <Section title="Contact">
            <dl className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2"><Mail className="size-4 text-slate-400" aria-hidden="true" /><dt className="sr-only">Email</dt><dd><a className="text-indigo-700 hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a></dd></div>
              <div className="flex items-center gap-2"><Phone className="size-4 text-slate-400" aria-hidden="true" /><dt className="sr-only">Phone</dt><dd>{lead.phone || 'Not provided'}</dd></div>
            </dl>
          </Section>
          <Section title="Company">
            <dl className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2"><Building2 className="size-4 text-slate-400" aria-hidden="true" /><dt className="sr-only">Company</dt><dd>{lead.company}</dd></div>
              <div className="flex items-center gap-2"><Tag className="size-4 text-slate-400" aria-hidden="true" /><dt className="sr-only">Source</dt><dd>{lead.source} · added {formatDate(lead.createdAt)}</dd></div>
            </dl>
          </Section>
          <Section title="Notes"><p className="whitespace-pre-wrap text-sm text-slate-600">{lead.notes || 'No notes yet. Use Edit lead to add some.'}</p></Section>
          <Section title="Follow-ups">
            {followUps.length === 0 ? <p className="text-sm text-slate-500">No follow-ups for this lead.</p> : (
              <ul className="space-y-2">{followUps.map((f) => <li key={f.id}><FollowUpCard followUp={f} compact onToggle={toggleFollowUp} /></li>)}</ul>
            )}
          </Section>
          <Section title="Activity"><ActivityTimeline activities={activities} emptyText="No activity yet." /></Section>
        </>
      )}
    </Overlay>
  )
}
