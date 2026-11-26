import { useState, type FormEvent } from 'react'
import { validateLead, emptyLeadValues } from '@/lib/validation'
import type { Lead, LeadFormErrors, LeadFormValues, LeadSource, LeadStatus } from '@/types'
import { SOURCES, STATUSES } from '@/lib/leads'

interface Props {
  formId: string
  initial: Lead | null
  onSubmit: (values: LeadFormValues) => void
}

const fieldClass = 'h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-indigo-600'

export function LeadForm({ formId, initial, onSubmit }: Props) {
  const [values, setValues] = useState<LeadFormValues>(
    initial ? { 
      name: initial.name, 
      email: initial.email, 
      phone: initial.phone ?? '', 
      company: initial.company, 
      source: initial.source, 
      status: initial.status, 
      notes: initial.notes ?? '' 
    } : emptyLeadValues,
  )
  const [errors, setErrors] = useState<LeadFormErrors>({})

  const set = (key: keyof LeadFormValues, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e: LeadFormErrors) => ({ ...e, [key]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // validateLead returns the errors object directly
    const validationErrors = validateLead(values)
    
    // If there are any keys in the error object, stop and show them
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    onSubmit(values)
  }

  return (
    <form id={formId} onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-name" className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
          <input id="lf-name" type="text" value={values.name} onChange={(e) => set('name', e.target.value)} className={fieldClass} aria-invalid={errors.name ? true : undefined} />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="lf-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input id="lf-email" type="email" value={values.email} onChange={(e) => set('email', e.target.value)} className={fieldClass} aria-invalid={errors.email ? true : undefined} />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-phone" className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <input id="lf-phone" type="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="lf-company" className="mb-1 block text-sm font-medium text-slate-700">Company</label>
          <input id="lf-company" type="text" value={values.company} onChange={(e) => set('company', e.target.value)} className={fieldClass} aria-invalid={errors.company ? true : undefined} />
          {errors.company && <p className="mt-1 text-xs text-rose-600">{errors.company}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-source" className="mb-1 block text-sm font-medium text-slate-700">Source</label>
          <select id="lf-source" value={values.source} onChange={(e) => set('source', e.target.value as LeadSource)} className={fieldClass}>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="lf-status" className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select id="lf-status" value={values.status} onChange={(e) => set('status', e.target.value as LeadStatus)} className={fieldClass}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="lf-notes" className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
        <textarea id="lf-notes" rows={3} value={values.notes} onChange={(e) => set('notes', e.target.value)} className={`${fieldClass} h-auto py-2`} />
      </div>
    </form>
  )
}
