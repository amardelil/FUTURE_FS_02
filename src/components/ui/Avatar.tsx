import { initials } from '@/lib/format'

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'size-7 text-[11px]', md: 'size-8 text-xs', lg: 'size-12 text-base' }[size]
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600 ring-1 ring-inset ring-slate-200 ${dims}`}>
      {initials(name)}
    </span>
  )
}
