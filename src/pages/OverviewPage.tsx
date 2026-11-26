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

export function OverviewPage() {
  const { leads, activities } = useCrm()
  const { viewLead, navigate } = useUi()
  const counts = countByStatus(leads)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total leads" value={leads.length} change={growthVsPrevious(leads)} hint="added vs previous 30 days" />
        <MetricCard label="New leads" value={counts.new} hint="waiting for first contact" />
        <MetricCard label="Contacted" value={counts.contacted} hint="in conversation" />
        <MetricCard label="Converted" value={counts.converted} hint="now customers" />
      </div>

      <section aria-label="Lead pipeline">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Pipeline</h2>
          <button type="button" onClick={() => navigate('leads')} className="text-sm text-indigo-700 hover:underline">View all leads</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {STATUSES.map(({ value, label }) => {
            const items = leads.filter((l) => l.status === value)
            return (
              <div key={value} className="rounded-lg border border-slate-200 bg-slate-100/60 p-2">
                <h3 className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-slate-700">
                  <span className={`size-2 rounded-full ${STATUS_DOT(value)}`} aria-hidden="true" />{label}
                  <span className="ml-auto text-xs font-normal text-slate-500">{items.length}</span>
                </h3>
                <ul className="space-y-2">
                  {items.slice(0, 3).map((l) => (
                    <li key={l.id}>
                      <button type="button" onClick={() => viewLead(l.id)} className="flex w-full items-center gap-2.5 rounded-md border border-slate-200 bg-white p-2.5 text-left shadow-sm hover:border-slate-300">
                        <Avatar name={l.name} size="sm" />
                        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{l.name}</span><span className="block truncate text-xs text-slate-500">{l.company}</span></span>
                        <span className="shrink-0 text-xs text-slate-400">{formatDate(l.createdAt).replace(/, \d{4}$/, '')}</span>
                      </button>
                    </li>
                  ))}
                  {items.length === 0 && <li className="px-2 py-3 text-sm text-slate-500">No leads in this stage.</li>}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2"><LeadsExplorer title="Recent leads" pageSize={5} /></div>
        <section aria-label="Recent activity" className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Recent activity</h2>
          <ActivityTimeline activities={activities} limit={7} emptyText="Activity appears here as you add and update leads." />
        </section>
      </div>
    </div>
  )
}
