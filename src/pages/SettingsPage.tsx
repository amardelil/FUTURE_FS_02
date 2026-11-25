import { Button } from '@/components/ui/Button'

export function SettingsPage() {
  const field = 'h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500'
  return (
    <div className="max-w-2xl space-y-6">
      <section aria-label="Profile" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Accounts and sign-in arrive with the backend in Phase 2, so these fields are read-only for now.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><label htmlFor="s-name" className="mb-1 block text-sm font-medium text-slate-700">Name</label><input id="s-name" className={field} value="Demo User" disabled readOnly /></div>
          <div><label htmlFor="s-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label><input id="s-email" className={field} value="demo@leadflow.app" disabled readOnly /></div>
          <div className="sm:col-span-2"><label htmlFor="s-ws" className="mb-1 block text-sm font-medium text-slate-700">Workspace</label><input id="s-ws" className={field} value="Demo workspace" disabled readOnly /></div>
        </div>
        <div className="mt-4"><Button variant="primary" disabled>Save changes</Button></div>
      </section>
    </div>
  )
}
