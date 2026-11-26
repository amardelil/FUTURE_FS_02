import { ApiError } from './api'

export const errorMessage = (e: unknown): string =>
  e instanceof ApiError ? e.message : 'Something went wrong. Try again.'
