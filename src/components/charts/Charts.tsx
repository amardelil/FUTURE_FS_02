interface Datum { label: string; value: number }

export function BarList({ data, total }: { data: Datum[]; total: number }) {
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex justify-between text-sm"><span className="text-slate-700">{d.label}</span><span className="text-slate-500">{d.value} · {total ? Math.round((d.value / total) * 100) : 0}%</span></div>
          <div className="h-2 rounded-full bg-slate-100" role="img" aria-label={`${d.label}: ${d.value} of ${total} leads`}>
            <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${total ? (d.value / total) * 100 : 0}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function StackedBar({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={data.map((d) => `${d.label}: ${d.value}`).join(', ')}>
        {data.map((d) => <div key={d.label} className={d.color} style={{ width: `${total ? (d.value / total) * 100 : 0}%` }} />)}
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-3">
        {data.map((d) => (
          <li key={d.label}>
            <p className="flex items-center gap-1.5 text-xs text-slate-500"><span className={`size-2 rounded-full ${d.color}`} aria-hidden="true" />{d.label}</p>
            <p className="text-lg font-semibold text-slate-900">{d.value}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ColumnChart({ data }: { data: Datum[] }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="flex h-48 items-end gap-3" role="img" aria-label={`Leads added per month: ${data.map((d) => `${d.label} ${d.value}`).join(', ')}`}>
      {data.map((d) => (
        <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-xs font-medium text-slate-600">{d.value}</span>
          <div className="w-full max-w-10 rounded-t bg-indigo-500" style={{ height: `${(d.value / max) * 80}%`, minHeight: d.value ? 4 : 2 }} />
          <span className="text-xs text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
