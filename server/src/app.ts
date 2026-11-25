import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { requireAuth } from './middleware/auth.js'
import { activityRoutes } from './routes/activity.routes.js'
import { analyticsRoutes } from './routes/analytics.routes.js'
import { authRoutes } from './routes/auth.routes.js'
import { followUpRoutes } from './routes/followUp.routes.js'
import { leadRoutes } from './routes/lead.routes.js'

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_ORIGIN }))
app.use(express.json({ limit: '100kb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: true, legacyHeaders: false }))

app.get('/api/health', (_req, res) => { res.json({ status: 'ok' }) })

app.use('/api/auth', authRoutes)
app.use('/api/leads', requireAuth, leadRoutes)
app.use('/api/follow-ups', requireAuth, followUpRoutes)
app.use('/api/activities', requireAuth, activityRoutes)
app.use('/api/analytics', requireAuth, analyticsRoutes)

app.use(notFound)
app.use(errorHandler)
