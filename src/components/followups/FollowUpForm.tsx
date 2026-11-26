import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import type { Priority } from '@/types'
import type { FollowUpInput } from '@/types/api'
import { Calendar, Flag, FileText } from 'lucide-react'

interface Props {
  leadId: string
  onSubmit: (input: FollowUpInput) => Promise<boolean>
  onCancel: () => void
}

const pad = (n: number) => String(n).padStart(2, '0')
const toLocalInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

const defaultWhen = () => {
  const d = new Date(Date.now() + 86_400_000)
  d.setHours(9, 0, 0, 0)
  return toLocalInput(d)
}

const fieldClass = 'h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all'

export function FollowUpForm({ leadId, onSubmit, onCancel }: Props) {
  const [when, setWhen] = useState(defaultWhen)
  const [priority, setPriority] = useState<Priority>('medium')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const date = new Date(when)
    if (!when || Number.isNaN(date.getTime())) { setError('Please choose a valid date and time.'); return }
    setBusy(true)
    const ok = await onSubmit({ leadId, scheduledAt: date.toISOString(), notes: notes.trim(), priority })
    setBusy(false)
    if (ok) onCancel()
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 animate-fade-up">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fu-when" className="mb-1.5 block text-xs font-semibold text-slate-700">Date and time</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input id="fu-when" type="datetime-local" value={when} onChange={(e) => { setWhen(e.target.value); setError(null) }} className={fieldClass} aria-invalid={error ? true : undefined} />
          </div>
        </div>
        <div>
          <label htmlFor="fu-priority" className="mb-1.5 block text-xs font-semibold text-slate-700">Priority</label>
          <div className="relative">
            <Flag className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <select id="fu-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={fieldClass}>
              <option value="low">Can wait</option>
              <option value="medium">Normal</option>
              <option value="high">Important</option>
            </select>
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      
      <div>
        <label htmlFor="fu-notes" className="mb-1.5 block text-xs font-semibold text-slate-700">What should you remember?</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 size-4 text-slate-400" />
          <textarea id="fu-notes" rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Call them back, send a quote..." className={`${fieldClass} h-auto py-2.5`} />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" className="h-9 bg-white border-slate-200 text-slate-600" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="h-9 shadow-sm" disabled={busy}>{busy ? 'Saving...' : 'Save Reminder'}</Button>
      </div>
    </form>
  )
}
