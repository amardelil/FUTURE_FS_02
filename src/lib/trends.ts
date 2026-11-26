import type { Lead } from '@/types'

const DAY = 86_400_000

/** % change in leads created over the last `days` vs the `days` before that. Undefined when there's no baseline. */
export function growthVsPrevious(leads: Lead[], days = 30): number | undefined {
  const now = Date.now()
  const age = (l: Lead) => now - Date.parse(l.createdAt)
  const current = leads.filter((l) => age(l) < days * DAY).length
  const previous = leads.filter((l) => age(l) >= days * DAY && age(l) < 2 * days * DAY).length
  return previous === 0 ? undefined : ((current - previous) / previous) * 100
}
