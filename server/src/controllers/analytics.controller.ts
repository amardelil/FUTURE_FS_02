import type { Request, Response } from 'express'
import { currentUserId } from '../middleware/auth.js'
import { FollowUp } from '../models/FollowUp.js'
import { Lead } from '../models/Lead.js'
import { oid } from '../utils/objectId.js'

interface Count<T> { _id: T; count: number }

export async function summary(req: Request, res: Response) {
  const owner = oid(currentUserId(req))
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1))

  const [byStatus, bySource, byMonth, overdueFollowUps] = await Promise.all([
    Lead.aggregate<Count<string>>([{ $match: { owner } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.aggregate<Count<string>>([{ $match: { owner } }, { $group: { _id: '$source', count: { $sum: 1 } } }]),
    Lead.aggregate<Count<{ y: number; m: number }>>([
      { $match: { owner, createdAt: { $gte: start } } },
      { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
    ]),
    FollowUp.countDocuments({ owner, completed: false, scheduledAt: { $lt: now } }),
  ])

  const status = (s: string) => byStatus.find((x) => x._id === s)?.count ?? 0
  const total = byStatus.reduce((sum, x) => sum + x.count, 0)

  const monthly = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1))
    const hit = byMonth.find((x) => x._id.y === d.getUTCFullYear() && x._id.m === d.getUTCMonth() + 1)
    return { label: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }), value: hit?.count ?? 0 }
  })

  res.json({
    totals: { total, new: status('new'), contacted: status('contacted'), converted: status('converted') },
    conversionRate: total ? (status('converted') / total) * 100 : 0,
    sources: bySource.map((x) => ({ label: x._id, value: x.count })).sort((a, b) => b.value - a.value),
    monthly,
    overdueFollowUps,
  })
}
