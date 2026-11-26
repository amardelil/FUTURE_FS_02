import { useCrm } from '@/context/CrmContext'
import { countByStatus, monthlyGrowth, sourceBreakdown } from '@/lib/leads'
import { BarChart3, TrendingUp, Users, CheckCircle2 } from 'lucide-react'

export function AnalyticsPage() {
  const { leads } = useCrm()
  const counts = countByStatus(leads)
  const total = leads.length
  const conversionRate = total ? ((counts.converted / total) * 100).toFixed(1) : '0'
  
  const growthData = monthlyGrowth(leads, 6)
  const maxGrowth = Math.max(...growthData.map(d => d.value), 1) // Prevent division by zero
  
  const sources = sourceBreakdown(leads).filter(s => s.value > 0)
  const maxSource = Math.max(...sources.map(s => s.value), 1)

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <BarChart3 className="size-6 text-indigo-600" /> Reports
        </h1>
        <p className="text-sm text-slate-500">See how your business is growing and where your customers come from.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-5"><Users className="size-24" /></div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500">Total Customers</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">{total}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-5"><CheckCircle2 className="size-24" /></div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500">Customers Won</p>
            <p className="mt-2 text-4xl font-bold text-emerald-600">{counts.converted}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 shadow-md text-white">
          <div className="absolute right-0 top-0 p-4 opacity-20"><TrendingUp className="size-24" /></div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-indigo-100">Win Rate</p>
            <p className="mt-2 text-4xl font-bold">{conversionRate}%</p>
            <p className="mt-1 text-xs text-indigo-200">of your contacts become customers</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Growth Chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">New Customers Added</h2>
            <p className="text-sm text-slate-500">Growth over the last 6 months</p>
          </div>
          
          <div className="flex h-64 items-end gap-2 sm:gap-4">
            {growthData.map((d, i) => {
              const height = Math.max((d.value / maxGrowth) * 100, 2); // min height of 2% so bar is visible
              return (
                <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-2 h-full">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 opacity-0 transition-opacity group-hover:opacity-100 bg-slate-900 text-white text-xs py-1 px-2 rounded pointer-events-none">
                    {d.value} added
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full rounded-t-md bg-indigo-100 group-hover:bg-indigo-500 transition-colors duration-300"
                    style={{ height: `${height}%` }}
                  >
                    <div className="h-full w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-purple-500 opacity-80" />
                  </div>
                  
                  <span className="text-xs font-medium text-slate-500">{d.label}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Where Customers Come From */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Where they come from</h2>
            <p className="text-sm text-slate-500">Top sources of your customers</p>
          </div>

          <div className="space-y-5">
            {sources.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-10">Add some customers to see this report.</p>
            )}
            {sources.map((s) => {
              const width = (s.value / maxSource) * 100;
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{s.label}</span>
                    <span className="text-slate-500 font-semibold">{s.value}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-1000 ease-out" 
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
