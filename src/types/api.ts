import type { FollowUp } from './index'

export interface User {
  id: string
  name: string
  email: string
}

export type FollowUpInput = Pick<FollowUp, 'leadId' | 'scheduledAt' | 'notes' | 'priority'>
