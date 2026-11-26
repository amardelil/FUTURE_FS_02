const TOKEN_KEY = 'leadflow.token'

export const tokenStore = {
  get(): string | null {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  },
  set(token: string): void {
    try { localStorage.setItem(TOKEN_KEY, token) } catch { /* storage unavailable */ }
  },
  clear(): void {
    try { localStorage.removeItem(TOKEN_KEY) } catch { /* storage unavailable */ }
  },
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message)
  }
}

let onUnauthorized: (() => void) | null = null
export const setUnauthorizedHandler = (fn: () => void): void => { onUnauthorized = fn }

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = tokenStore.get()
  let res: Response
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Can’t reach the server. Check that the API is running.')
  }

  if (res.status === 204) return undefined as T
  const data = (await res.json().catch(() => null)) as { message?: string; details?: Record<string, string[]> } | null

  if (!res.ok) {
    if (res.status === 401 && token) onUnauthorized?.()
    throw new ApiError(res.status, data?.message ?? 'Request failed. Try again.', data?.details)
  }
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T = void>(path: string, body?: unknown) => request<T>('DELETE', path, body),
}
