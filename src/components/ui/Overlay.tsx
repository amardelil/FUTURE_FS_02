import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface OverlayProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  variant: 'drawer' | 'modal'
  children: ReactNode
  footer?: ReactNode
}

/** Shared dialog shell: Esc to close, backdrop click, focus moves in on open and returns on close. */
export function Overlay({ open, onClose, title, description, variant, children, footer }: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  const isDrawer = variant === 'drawer'
  return (
    <div className={`fixed inset-0 z-50 flex ${isDrawer ? 'justify-end' : 'items-center justify-center p-4'}`}>
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative flex flex-col bg-white shadow-xl outline-none ${
          isDrawer ? 'h-full w-full max-w-md border-l border-slate-200' : 'max-h-[90vh] w-full max-w-lg rounded-lg border border-slate-200'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-1 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}
