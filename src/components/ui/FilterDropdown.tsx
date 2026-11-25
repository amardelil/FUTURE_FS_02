interface FilterDropdownProps<T extends string> {
  label: string
  value: T | 'all'
  options: { value: T; label: string }[]
  allLabel: string
  onChange: (value: T | 'all') => void
}

export function FilterDropdown<T extends string>({ label, value, options, allLabel, onChange }: FilterDropdownProps<T>) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as T | 'all')}
      className="h-9 rounded-md border border-slate-300 bg-white px-2.5 text-sm text-slate-700 hover:border-slate-400 focus:border-indigo-600"
    >
      <option value="all">{allLabel}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
