import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps { page: number; totalPages: number; total: number; pageSize: number; onChange: (page: number) => void }

export function Pagination({ page, totalPages, total, pageSize, onChange }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const btn = 'inline-flex size-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
      <p>Showing {from}–{to} of {total}</p>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline">Page {page} of {totalPages}</span>
        <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft className="size-4" /></button>
        <button type="button" className={btn} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight className="size-4" /></button>
      </div>
    </nav>
  )
}
