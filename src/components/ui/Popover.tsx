import { useEffect, useRef, useState, type ReactNode } from 'react'

interface PopoverProps {
  label: string
  trigger: ReactNode
  align?: 'left' | 'right'
  width?: string
  children: (close: () => void) => ReactNode
}

export function Popover({ label, trigger, align = 'right', width = 'w-56', children }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label={label} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="rounded-md">
        {trigger}
      </button>
      {open && (
        <div className={`absolute top-full z-40 mt-2 ${width} ${align === 'right' ? 'right-0' : 'left-0'} rounded-lg border border-slate-200 bg-white py-1 shadow-lg`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}
