import type { LeadFormErrors, LeadFormValues } from '@/types'

export const emptyLeadValues: LeadFormValues = {
  name: '', email: '', phone: '', company: '', source: 'Website', status: 'new', notes: '',
}

export function validateLead(v: LeadFormValues): LeadFormErrors {
  const errors: LeadFormErrors = {}
  if (v.name.trim().length < 2) errors.name = 'Enter the lead’s full name.'
  if (!v.email.trim()) errors.email = 'Enter an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = 'Enter a valid email, like name@company.com.'
  if (v.phone.trim() && !/^[+\d][\d\s().-]{6,}$/.test(v.phone.trim())) errors.phone = 'Use digits, spaces, and an optional leading +.'
  if (!v.company.trim()) errors.company = 'Enter the company name.'
  if (v.notes.length > 500) errors.notes = 'Keep notes under 500 characters.'
  return errors
}
