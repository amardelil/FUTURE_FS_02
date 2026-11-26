import { LeadsExplorer } from '@/components/leads/LeadsExplorer'

export function LeadsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold tracking-tight text-slate-900">Leads</h1>
      <LeadsExplorer pageSize={10} bulk />
    </div>
  )
}
