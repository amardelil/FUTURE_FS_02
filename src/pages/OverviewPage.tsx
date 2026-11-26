import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { countByStatus, STATUSES } from '@/lib/leads'
import { formatDate } from '@/lib/format'
import { growthVsPrevious } from '@/lib/trends'
import { ActivityTimeline } from '@/components/activity/ActivityTimeline'
import { Avatar } from '@/components/ui/Avatar'
import { STATUS_DOT } from '@/components/ui/Badges'
import { MetricCard } from '@/components/ui/MetricCard'
import { LeadsExplorer } from '@/components/leads/LeadsExplorer'
import { Plus, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function OverviewPage() {
  const { leads, activities } = useCrm()
  const { viewLead, navigate, openLeadForm } = useUi()
  const counts = countByStatus(leads)

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white shadow-xl">
        
        {/* Background Chart Graphic (Visually fills the right side) */}
        <div className="absolute right-0 bottom-0 top-0 hidden w-3/5 items-end justify-end gap-2 p-8 opacity-40 md:flex pointer-events-none">
          <div className="w-12 h-1/3 rounded-t-md bg-white/20"></div>
          <div className="w-12 h-1/2 rounded-t-md bg-purple-300/30"></div>
          <div className="w-12 h-2/3 rounded-t-md bg-indigo-300/40"></div>
          <div className="w-12 h-1/4 rounded-t-md bg-pink-300/20"></div>
          <div className="w-12 h-3/4 rounded-t-md bg-purple-300/50"></div>
          <div className="w-12 h-1/2 rounded-t-md bg-white/30"></div>
          <div className="w-12 h-5/6 rounded-t-md bg-indigo-300/60"></div>
          <div className="w-12 h-full rounded-t-md bg-gradient-to-t from-indigo-500/50 to-purple-400/80"></div>
        </div>

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md">
              <Sparkles className="size-4 text-yellow-300" />
              <span>Welcome to your dashboard</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl drop-shadow-sm">Grow your business, one customer at a time.</h1>
            <p className="mt-3 text-indigo-100 text-lg">Keep track of your contacts, never miss a follow-up, and watch your sales grow.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => openLeadForm()} className="bg-white text-indigo-700 hover:bg-slate-100 border-0 shadow-lg shadow-indigo-900/20">
                <Plus className="mr-2 size-4" /> Add Customer
              </Button>
              
              <button onClick={() => navigate('reports')} className="flex items-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-md transition-colors hover:bg-white/20">
                View Reports <ArrowRight className="ml-2 size-4" />
              </button>
            </div>
          </div>
          
          {/* Floating Circle on top of the chart */}
          <div className="hidden md:flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 p-1 shadow-2xl animate-float">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-900/40 backdrop-blur-md border border-white/10">
               <TrendingUp className="size-20 text-white/90 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total contacts" value={leads.length} change={growthVsPrevious(leads)} hint="added vs previous 30 days" />
        <MetricCard label="New contacts" value={counts.new} hint="waiting for first contact" />
        <MetricCard label="Contacted" value={counts.contacted} hint="in conversation" />
        <MetricCard label="Closed" value={counts.converted} hint="now customers" />
      </div>

      {/* Pipeline / Progress */}
      <section aria-label="Lead pipeline">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Progress</h2>
          <button type="button" onClick={() => navigate('customers')} className="text-sm font-medium text-indigo-700 hover:underline">View all customers</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {STATUSES.map(({ value, label }) => {
            const items = leads.filter((l) => l.status === value)
            return (
              <div key={value} className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <h3 className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
                  <span className={`size-2.5 rounded-full ${STATUS_DOT(value)}`} aria-hidden="true" />{label}
                  <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{items.length}</span>
                </h3>
                <ul className="p-2">
                  {items.slice(0, 3).map((l) => (
                    <li key={l.id}>
                      <button type="button" onClick={() => viewLead(l.id)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-slate-50">
                        <Avatar name={l.name} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-slate-900">{l.name}</span>
                          <span className="block truncate text-xs text-slate-500">{l.company}</span>
                        </span>
                        <span className="shrink-0 text-xs font-medium text-slate-400">{formatDate(l.createdAt).replace(/, \d{4}$/, '')}</span>
                      </button>
                    </li>
                  ))}
                  {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-slate-500">No customers in this level.</li>}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2"><LeadsExplorer title="Recent customers" pageSize={5} /></div>
        <section aria-label="Recent activity" className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent activity</h2>
          <ActivityTimeline activities={activities} limit={7} emptyText="Activity appears here as you add and contact customers." />
        </section>
      </div>
    </div>
  )
}
