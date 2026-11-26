import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const field = 'h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600'
  return (
    <div className="max-w-2xl space-y-6">
      <section aria-label="Profile" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Editing your profile isn’t available yet.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="s-name" className="mb-1 block text-sm font-medium text-slate-700">Name</label><input id="s-name" className={field} value={user?.name ?? ''} disabled readOnly /></div>
          <div><label htmlFor="s-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label><input id="s-email" className={field} value={user?.email ?? ''} disabled readOnly /></div>
        </div>
      </section>
      <section aria-label="Session" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Session</h2>
        <p className="mt-1 text-sm text-slate-500">Sign out of LeadFlow on this device.</p>
        <div className="mt-4"><Button onClick={logout}>Sign out</Button></div>
      </section>
    </div>
  )
}