import { Building2, CalendarPlus, Mail, Pencil, Phone, Tag, Trash2, UserCircle } from 'lucide-react'
import { Overlay } from '@/components/ui/Overlay'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { LeadStatusBadge } from '@/components/ui/Badges'
import { ActivityTimeline } from '@/components/activity/ActivityTimeline'
import { FollowUpCard } from '@/components/followups/FollowUpCard'
import { FollowUpForm } from '@/components/followups/FollowUpForm'
import { useCrm } from '@/context/CrmContext'
import { formatDate } from '@/lib/format'
import type { Activity, FollowUp, Lead } from '@/types'
import { useState, useEffect, type ReactNode } from 'react'

interface Props {
  lead: Lead | null
  followUps: FollowUp[]
  activities: Activity[]
  onClose: () => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

const Section = ({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) => (
  <section className="border-t border-slate-100 py-5 first:border-0 first:pt-0">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {action}
    </div>
    {children}
  </section>
)

export function LeadDetailsDrawer({ lead, followUps, activities, onClose, onEdit, onDelete }: Props) {
  const { toggleFollowUp, deleteFollowUp, addFollowUp } = useCrm()
  const [scheduling, setScheduling] = useState(false)
  useEffect(() => setScheduling(false), [lead?.id])

  return (
    <Overlay
      open={lead !== null}
      onClose={onClose}
      title="Customer Details"
      variant="drawer"
      footer={lead && (
        <>
          <Button variant="ghost" className="mr-auto text-rose-700 hover:bg-rose-50" onClick={() => onDelete(lead)}><Trash2 className="size-4 mr-2" />Remove</Button>
          <Button variant="primary" onClick={() => onEdit(lead)}><Pencil className="size-4 mr-2" />Edit Customer</Button>
        </>
      )}
    >
      {lead && (
        <div className="animate-fade-up">
          {/* Beautiful Header */}
          <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-5 border border-indigo-100">
            <div className="flex items-center gap-4">
              <Avatar name={lead.name} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-bold text-slate-900">{lead.name}</p>
                <p className="truncate text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5"><Building2 className="size-3.5" /> {lead.company}</p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>

          <Section title="Contact Information">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                <Mail className="size-4 text-indigo-500" aria-hidden="true" />
                <a className="hover:text-indigo-700 hover:underline truncate" href={`mailto:${lead.email}`}>{lead.email}</a>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
                <Phone className="size-4 text-emerald-500" aria-hidden="true" />
                <span>{lead.phone || 'No phone number'}</span>
              </div>
            </div>
          </Section>
          
          <Section title="More Details">
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2"><Tag className="size-4 text-slate-400" /> Found via <span className="font-medium text-slate-900">{lead.source}</span></div>
              <div className="flex items-center gap-2"><UserCircle className="size-4 text-slate-400" /> Recorded on {formatDate(lead.createdAt)}</div>
            </div>
          </Section>

          <Section title="Notes">
            <div className="rounded-lg bg-amber-50/50 p-4 border border-amber-100 text-sm text-slate-700 whitespace-pre-wrap">
              {lead.notes || 'No notes yet. Click Edit Customer to add some.'}
            </div>
          </Section>

          <Section
            title="Reminders"
            action={!scheduling && (
              <button type="button" onClick={() => setScheduling(true)} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors">
                <CalendarPlus className="size-3.5" aria-hidden="true" />Schedule
              </button>
            )}
          >
            {scheduling && <div className="mb-4 animate-fade-up"><FollowUpForm leadId={lead.id} onSubmit={addFollowUp} onCancel={() => setScheduling(false)} /></div>}
            {followUps.length === 0 && !scheduling
              ? <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg text-center border border-dashed border-slate-200">No reminders for this customer.</p>
              : <ul className="space-y-2">{followUps.map((f) => <li key={f.id}><FollowUpCard followUp={f} compact onToggle={toggleFollowUp} onDelete={deleteFollowUp} /></li>)}</ul>}
          </Section>
          
          <Section title="Activity History">
            <ActivityTimeline activities={activities} emptyText="No activity yet." />
          </Section>
        </div>
      )}
    </Overlay>
  )
}
