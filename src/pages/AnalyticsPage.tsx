import type { ReactNode } from 'react'
import { useCrm } from '@/context/CrmContext'
import { countByStatus, conversionRate, monthlyGrowth, sourceBreakdown } from '@/lib/leads'
import { BarList, ColumnChart, StackedBar } from '@/components/charts/Charts'

const Card = ({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) => (
  <section aria-label={title} className={`rounded-lg border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
    <h2 className="mb-4 text-sm font-semibold text-slate-900">{title}</h2>
    {children}
  </section>
)

export function AnalyticsPage() {
  const { leads } = useCrm()
  const counts = countByStatus(leads)
  const growth = monthlyGrowth(leads)
  const stat = (label: string, value: string) => (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p></div>
  )
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stat('Total leads', String(leads.length))}
        {stat('Conversion rate', `${conversionRate(leads).toFixed(1)}%`)}
        {stat('Leads this month', String(growth[growth.length - 1]?.value ?? 0))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Lead sources"><BarList data={sourceBreakdown(leads)} total={leads.length} /></Card>
        <Card title="Status distribution">
          <StackedBar data={[
            { label: 'New', value: counts.new, color: 'bg-indigo-500' },
            { label: 'Contacted', value: counts.contacted, color: 'bg-amber-500' },
            { label: 'Converted', value: counts.converted, color: 'bg-emerald-500' },
          ]} />
        </Card>
        <Card title="Monthly lead growth" className="lg:col-span-2"><ColumnChart data={growth} /></Card>
      </div>
    </div>
  )
}
