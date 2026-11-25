import { TrendingDown, TrendingUp } from 'lucide-react'

interface MetricCardProps { label: string; value: string | number; change: number; hint?: string }

export function MetricCard({ label, value, change, hint = 'vs last 30 days' }: MetricCardProps) {
  const up = change >= 0
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
        <span className={`inline-flex items-center gap-1 font-medium ${up ? 'text-emerald-700' : 'text-rose-700'}`}>
          <Icon className="size-3.5" aria-hidden="true" />
          {up ? '+' : ''}{change.toFixed(1)}%
        </span>
        {hint}
      </p>
    </div>
  )
}
