import { useState, type FormEvent } from 'react'
import { BarChart3 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { BRAND } from '@/lib/copy'
import { Button } from '@/components/ui/Button'

type Mode = 'login' | 'register'

export function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [busy, setBusy] = useState(false)

  const isRegister = mode === 'register'
  const set = (key: keyof typeof values, value: string) => setValues((v) => ({ ...v, [key]: value }))
  const switchMode = () => { setMode(isRegister ? 'login' : 'register'); setError(null); setFieldErrors({}) }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setFieldErrors({})
    try {
      if (isRegister) await register(values.name, values.email, values.password)
      else await login(values.email, values.password)
    } catch (err) {
      if (err instanceof ApiError) { setError(err.message); setFieldErrors(err.details ?? {}) }
      else setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const input = (id: keyof typeof values, label: string, type: string, auto: string) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={auto}
        value={values[id]}
        onChange={(e) => set(id, e.target.value)}
        aria-invalid={fieldErrors[id] ? true : undefined}
        aria-describedby={fieldErrors[id] ? `${id}-error` : undefined}
        className={`h-10 w-full rounded-md border bg-white px-3 text-sm focus:border-indigo-600 ${fieldErrors[id] ? 'border-rose-400' : 'border-slate-300 hover:border-slate-400'}`}
      />
      {fieldErrors[id]?.[0] && <p id={`${id}-error`} className="mt-1 text-xs text-rose-600">{fieldErrors[id][0]}</p>}
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-50/60 to-slate-50 px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white" aria-hidden="true"><BarChart3 className="size-4.5" /></span>
            <span className="text-xl font-semibold tracking-tight">{BRAND.name}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{BRAND.tagline}</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-base font-semibold text-slate-900">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          {error && Object.keys(fieldErrors).length === 0 && <p role="alert" className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          {isRegister && input('name', 'Your name', 'text', 'name')}
          {input('email', 'Email', 'email', 'email')}
          {input('password', 'Password', 'password', isRegister ? 'new-password' : 'current-password')}
          {isRegister && <p className="-mt-2 text-xs text-slate-500">Use at least 8 characters.</p>}
          <Button type="submit" variant="primary" className="h-10 w-full" disabled={busy}>
            {busy ? 'One moment…' : isRegister ? 'Create my account' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          {isRegister ? 'Already have an account?' : 'New to CustomerFlow?'}{' '}
          <button type="button" onClick={switchMode} className="font-medium text-indigo-700 hover:underline">
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </div>
    </div>
  )
}
