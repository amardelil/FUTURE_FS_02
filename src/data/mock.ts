// Phase 1 mock data. Replaced by API calls in Phase 3.
import type { Activity, FollowUp, Lead, LeadSource, LeadStatus, Priority } from '@/types'

const DAY = 86_400_000
const at = (days: number, hour = 9): string => {
  const d = new Date(Date.now() + days * DAY)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

type LeadRow = [name: string, company: string, domain: string, source: LeadSource, status: LeadStatus, daysAgo: number, notes: string]

const rows: LeadRow[] = [
  ['Amara Okafor', 'Northwind Studio', 'northwind.studio', 'Referral', 'converted', 142, 'Signed a 6-month brand retainer.'],
  ['Daniel Whitfield', 'Brightline Legal', 'brightline.law', 'Website', 'converted', 118, 'Website rebuild, paid deposit.'],
  ['Selam Tesfaye', 'Habesha Roasters', 'habesharoasters.com', 'Event', 'converted', 96, 'Met at the Addis coffee expo.'],
  ['Priya Nair', 'Cobalt Analytics', 'cobalt.io', 'LinkedIn', 'converted', 71, 'Needs a monthly dashboard refresh.'],
  ['Marcus Lindqvist', 'Fjord Outdoor', 'fjordoutdoor.se', 'Cold email', 'contacted', 58, 'Asked for a proposal by month end.'],
  ['Hanna Berhane', 'Selamta Travel', 'selamta.travel', 'Social media', 'contacted', 44, 'Comparing us with two other agencies.'],
  ['Tomas Rivera', 'Casa Verde Foods', 'casaverde.co', 'Website', 'contacted', 37, 'Wants e-commerce plus email flows.'],
  ['Eleni Gebre', 'Orbit Clinic', 'orbitclinic.org', 'Referral', 'contacted', 29, 'Referred by Daniel. Booking system needed.'],
  ['Jonas Weber', 'Kettle & Co', 'kettleandco.de', 'LinkedIn', 'contacted', 21, 'Budget confirmed, waiting on sign-off.'],
  ['Sofia Marino', 'Lumen Interiors', 'lumeninteriors.it', 'Social media', 'new', 12, 'Found us through an Instagram case study.'],
  ['Kwame Mensah', 'Gold Coast Logistics', 'gclogistics.com', 'Cold email', 'new', 9, 'Replied to the first outreach email.'],
  ['Lina Haddad', 'Atlas Fitness', 'atlasfit.ae', 'Website', 'new', 6, 'Submitted the contact form.'],
  ['Ben Carter', 'Harbor Books', 'harborbooks.com', 'Event', 'new', 4, 'Small shop, wants a simple storefront.'],
  ['Yonas Alemu', 'Zega Software', 'zega.dev', 'Referral', 'new', 3, 'Early-stage startup, needs a landing page.'],
  ['Chloe Dubois', 'Maison Pierre', 'maisonpierre.fr', 'LinkedIn', 'new', 2, 'Interested in a bilingual site.'],
  ['Omar Siddiqui', 'Crescent Dental', 'crescentdental.pk', 'Website', 'new', 1, 'Wants appointment reminders.'],
]

export const mockLeads: Lead[] = rows.map(([name, company, domain, source, status, daysAgo, notes], i) => {
  const [first, ...rest] = name.toLowerCase().split(' ')
  return {
    id: `lead-${i + 1}`,
    name,
    email: `${first}.${rest.join('')}@${domain}`,
    phone: `+1 555 01${String(10 + i * 3).padStart(2, '0')}`,
    company,
    source,
    status,
    notes,
    createdAt: at(-daysAgo, 10),
    updatedAt: at(-Math.floor(daysAgo / 3), 10),
  }
})

const f = (n: number, leadId: string, days: number, hour: number, priority: Priority, notes: string, completed = false): FollowUp =>
  ({ id: `fu-${n}`, leadId, scheduledAt: at(days, hour), notes, priority, completed })

export const mockFollowUps: FollowUp[] = [
  f(1, 'lead-5', -3, 10, 'high', 'Send the revised proposal and pricing.'),
  f(2, 'lead-7', -1, 14, 'medium', 'Check if they reviewed the email flow scope.'),
  f(3, 'lead-9', 0, 23, 'high', 'Call to confirm the budget sign-off.'),
  f(4, 'lead-8', 1, 11, 'medium', 'Demo the booking flow.'),
  f(5, 'lead-11', 2, 9, 'low', 'Share two relevant case studies.'),
  f(6, 'lead-6', 4, 15, 'medium', 'Follow up after their agency comparison.'),
  f(7, 'lead-14', 6, 10, 'low', 'Intro call to scope the landing page.'),
  f(8, 'lead-4', -6, 10, 'low', 'Onboarding check-in.', true),
  f(9, 'lead-9', -9, 13, 'medium', 'Initial discovery call.', true),
]

export const mockActivities: Activity[] = (() => {
  const list: Activity[] = []
  let n = 0
  const push = (leadId: string, type: Activity['type'], description: string, createdAt: string) =>
    list.push({ id: `act-${++n}`, leadId, type, description, createdAt })
  for (const l of mockLeads) {
    const created = Date.parse(l.createdAt)
    push(l.id, 'lead_created', `${l.name} was added as a new lead`, l.createdAt)
    if (l.status !== 'new') push(l.id, 'lead_contacted', `Reached out to ${l.name} at ${l.company}`, new Date(created + 2 * DAY).toISOString())
    if (l.status === 'converted') push(l.id, 'lead_converted', `${l.name} converted to a customer`, l.updatedAt)
  }
  for (const fu of mockFollowUps) {
    const lead = mockLeads.find((l) => l.id === fu.leadId)
    if (lead) push(lead.id, 'followup_scheduled', `Follow-up scheduled with ${lead.name}`, at(-8, 12))
  }
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})()

// Hardcoded comparison figures for the metric cards (mock only).
export const mockTrends = { total: 12.5, new: 8.3, contacted: -4.1, converted: 20 }
