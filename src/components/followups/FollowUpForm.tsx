import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import type { Priority } from '@/types'
import type { FollowUpInput } from '@/types/api'

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

const fieldClass = 'h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-indigo-600'

export function FollowUpForm({ leadId, onSubmit, onCancel }: Props) {
  const [when, setWhen] = useState(defaultWhen)
  const [priority, setPriority] = useState<Priority>('medium')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const date = new Date(when)
    if (!when || Number.isNaN(date.getTime())) { setError('Choose a date and time.'); return }
    setBusy(true)
    const ok = await onSubmit({ leadId, scheduledAt: date.toISOString(), notes: notes.trim(), priority })
    setBusy(false)
    if (ok) onCancel()
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="fu-when" className="mb-1 block text-xs font-medium text-slate-700">Date and time</label>
          <input id="fu-when" type="datetime-local" value={when} onChange={(e) => { setWhen(e.target.value); setError(null) }} className={fieldClass} aria-invalid={error ? true : undefined} aria-describedby={error ? 'fu-error' : undefined} />
        </div>
        <div>
          <label htmlFor="fu-priority" className="mb-1 block text-xs font-medium text-slate-700">Priority</label>
          <select id="fu-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={fieldClass}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      {error && <p id="fu-error" className="text-xs text-rose-600">{error}</p>}
      <div>
        <label htmlFor="fu-notes" className="mb-1 block text-xs font-medium text-slate-700">Notes</label>
        <textarea id="fu-notes" rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${fieldClass} h-auto py-2`} />
      </div>
      <div className="flex justify-end gap-2">
        <Button className="h-8" onClick={onCancel}>Cancel</Button>
        <Button className="h-8" variant="primary" type="submit" disabled={busy}>{busy ? 'Scheduling…' : 'Schedule'}</Button>
      </div>
    </form>
  )
}