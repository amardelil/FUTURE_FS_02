import { Plus } from 'lucide-react'
import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { Button } from '@/components/ui/Button'
import { LeadsExplorer } from '@/components/leads/LeadsExplorer'

export function LeadsPage() {
  const { leads } = useCrm()
  const { openLeadForm, globalSearch } = useUi()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{leads.length} leads in your pipeline. Select rows to update several at once.</p>
        <Button variant="primary" onClick={() => openLeadForm()}><Plus className="size-4" />Add lead</Button>
      </div>
      <LeadsExplorer pageSize={8} bulk initialQuery={globalSearch} />
    </div>
  )
}
