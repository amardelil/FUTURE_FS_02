import { LeadsExplorer } from '@/components/leads/LeadsExplorer'
import { Users } from 'lucide-react'

export function LeadsPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="size-6 text-indigo-600" /> Customers
        </h1>
        <p className="text-sm text-slate-500">Manage your contacts, track their status, and keep your notes organized.</p>
      </div>
      <LeadsExplorer pageSize={10} bulk />
    </div>
  )
}
