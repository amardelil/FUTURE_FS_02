import { useCrm } from '@/context/CrmContext'

export function AnalyticsPage() {
  const { leads } = useCrm()
  const total = leads.length
  const converted = leads.filter(l => l.status === 'converted').length
  const conversionRate = total ? ((converted / total) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold tracking-tight text-slate-900">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Leads</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{total}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Converted</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{converted}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Conversion Rate</p>
          <p className="mt-1 text-2xl font-semibold text-indigo-700">{conversionRate}%</p>
        </div>
      </div>
    </div>
  )
}
