import type { LeadStatus, Priority } from '@/types'

export const BRAND = {
  name: 'CustomerFlow',
  tagline: 'Every customer matters. Every opportunity grows.',
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Customer won',
}

export const STATUS_HELP: Record<LeadStatus, string> = {
  new: "You haven't contacted them yet",
  contacted: "You've reached out to them",
  converted: "They became a customer",
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'Important',
  medium: 'Normal',
  low: 'Can wait',
}

export const FIELD = {
  name: 'Full name',
  email: 'Email',
  phone: 'Phone number',
  company: 'Company or business',
  source: 'Where they found you',
  status: 'Contact status',
  notes: 'Notes',
}

export const EMPTY = {
  customers: {
    title: "You haven't added any customers yet.",
    body: 'Start building your customer list. Keep their details, conversations, and next steps all in one place.',
    action: 'Add your first customer',
  },
  search: {
    title: 'Nothing matches your search.',
    body: 'Try another search or clear your filters.',
    action: 'Clear filters',
  },
  activity: 'Nothing has happened yet. When you add or contact customers, it will show up here.',
}

export const MESSAGES = {
  customerAdded: 'Customer added successfully.',
  customerSaved: 'Your changes have been saved.',
  customerRemoved: 'Customer removed.',
  customersRemoved: (n: number) => `${n} customers removed.`,
  statusUpdated: (n: number, status: LeadStatus) =>
    `${n} ${n === 1 ? 'customer' : 'customers'} marked as ${STATUS_LABEL[status].toLowerCase()}.`,
  reminderAdded: 'Reminder created.',
  reminderRemoved: 'Reminder removed.',
}
