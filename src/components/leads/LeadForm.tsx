import { useState, type FormEvent, type ReactNode } from 'react'
import { SOURCES, STATUSES } from '@/lib/leads'
import { emptyLeadValues, validateLead } from '@/lib/validation'
import type { Lead, LeadFormErrors, LeadFormValues, LeadSource, LeadStatus } from '@/types'

interface LeadFormProps { formId: string; initial: Lead | null; onSubmit: (values: LeadFormValues) => void }

const inputClass = (error?: string) =>
  `h-9 w-full rounded-md border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 ${error ? 'border-rose-400' : 'border-slate-300 hover:border-slate-400'}`

function Field({ id, label, error, required, children }: { id: string; label: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}{required && <span className="text-rose-600" aria-hidden="true"> *</span>}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}

export function LeadForm({ formId, initial, onSubmit }: LeadFormProps) {
  const [values, setValues] = useState<LeadFormValues>(
    initial ? { name: initial.name, email: initial.email, phone: initial.phone, company: initial.company, source: initial.source, status: initial.status, notes: initial.notes } : emptyLeadValues,
  )
  const [errors, setErrors] = useState<LeadFormErrors>({})

  const set = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validateLead(values)
    setErrors(found)
    if (Object.keys(found).length === 0) onSubmit({ ...values, name: values.name.trim(), email: values.email.trim(), company: values.company.trim(), phone: values.phone.trim() })
  }

  const a11y = (key: keyof LeadFormValues) => ({ 'aria-invalid': errors[key] ? true : undefined, 'aria-describedby': errors[key] ? `${key}-error` : undefined })

  return (
    <form id={formId} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2"><Field id="name" label="Full name" required error={errors.name}>
        <input id="name" autoFocus value={values.name} onChange={(e) => set('name', e.target.value)} className={inputClass(errors.name)} autoComplete="off" {...a11y('name')} />
      </Field></div>
      <Field id="email" label="Email" required error={errors.email}>
        <input id="email" type="email" value={values.email} onChange={(e) => set('email', e.target.value)} className={inputClass(errors.email)} {...a11y('email')} />
      </Field>
      <Field id="phone" label="Phone" error={errors.phone}>
        <input id="phone" type="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass(errors.phone)} {...a11y('phone')} />
      </Field>
      <div className="sm:col-span-2"><Field id="company" label="Company" required error={errors.company}>
        <input id="company" value={values.company} onChange={(e) => set('company', e.target.value)} className={inputClass(errors.company)} {...a11y('company')} />
      </Field></div>
      <Field id="source" label="Lead source">
        <select id="source" value={values.source} onChange={(e) => set('source', e.target.value as LeadSource)} className={inputClass()}>
          {SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field id="status" label="Status">
        <select id="status" value={values.status} onChange={(e) => set('status', e.target.value as LeadStatus)} className={inputClass()}>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2"><Field id="notes" label="Notes" error={errors.notes}>
        <textarea id="notes" rows={4} value={values.notes} onChange={(e) => set('notes', e.target.value)} className={`${inputClass(errors.notes)} h-auto py-2`} {...a11y('notes')} />
        <p className="mt-1 text-right text-xs text-slate-400">{values.notes.length}/500</p>
      </Field></div>
    </form>
  )
}
