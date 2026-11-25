import { CheckCircle2 } from 'lucide-react'
import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog'
import { Overlay } from '@/components/ui/Overlay'
import { Button } from '@/components/ui/Button'
import { LeadDetailsDrawer } from '@/components/leads/LeadDetailsDrawer'
import { LeadForm } from '@/components/leads/LeadForm'
import { activitiesForLead } from '@/lib/leads'
import type { LeadFormValues } from '@/types'

/** Global overlays: lead form, details drawer, delete confirmation, and toast. */
export function LeadModals() {
  const crm = useCrm()
  const ui = useUi()
  const { leadForm, detailsLeadId, deleteIds } = ui
  const detailsLead = crm.leads.find((l) => l.id === detailsLeadId) ?? null
  const editing = leadForm.lead

  const handleSubmit = (values: LeadFormValues) => {
    if (editing) { crm.updateLead(editing.id, values); ui.showToast(`Saved changes to ${values.name}`) }
    else { crm.addLead(values); ui.showToast(`${values.name} added to your leads`) }
    ui.closeLeadForm()
  }

  const handleDelete = () => {
    if (!deleteIds) return
    crm.deleteLeads(deleteIds)
    if (detailsLeadId && deleteIds.includes(detailsLeadId)) ui.viewLead(null)
    ui.showToast(deleteIds.length === 1 ? 'Lead deleted' : `${deleteIds.length} leads deleted`)
    ui.requestDelete(null)
  }

  const deleteName = deleteIds?.length === 1 ? crm.leads.find((l) => l.id === deleteIds[0])?.name : null

  return (
    <>
      <LeadDetailsDrawer
        lead={detailsLead}
        followUps={crm.followUps.filter((f) => f.leadId === detailsLeadId)}
        activities={detailsLeadId ? activitiesForLead(crm.activities, detailsLeadId) : []}
        onClose={() => ui.viewLead(null)}
        onEdit={(lead) => ui.openLeadForm(lead)}
        onDelete={(lead) => ui.requestDelete([lead.id])}
      />
      <Overlay
        open={leadForm.open}
        onClose={ui.closeLeadForm}
        title={editing ? 'Edit lead' : 'Add lead'}
        description={editing ? 'Update this lead’s details.' : 'Add a potential client to your pipeline.'}
        variant="modal"
        footer={<><Button onClick={ui.closeLeadForm}>Cancel</Button><Button variant="primary" type="submit" form="lead-form">{editing ? 'Save changes' : 'Add lead'}</Button></>}
      >
        <LeadForm key={editing?.id ?? 'new'} formId="lead-form" initial={editing} onSubmit={handleSubmit} />
      </Overlay>
      <ConfirmationDialog
        open={deleteIds !== null}
        title={deleteIds && deleteIds.length > 1 ? `Delete ${deleteIds.length} leads?` : 'Delete this lead?'}
        message={`${deleteName ? `${deleteName} and their` : 'These leads and their'} follow-ups and activity will be removed. This can’t be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => ui.requestDelete(null)}
      />
      {ui.toast && (
        <div role="status" className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">
          <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />{ui.toast}
        </div>
      )}
    </>
  )
}
