import { useAuth } from '@/context/AuthContext'
import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { User, LogOut, RotateCcw, Database, ShieldAlert, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function SettingsPage() {
  const { user, logout } = useAuth()
  const { reload, leads } = useCrm()
  const { showToast } = useUi()
  const [loading, setLoading] = useState(false)
  
  const field = 'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none cursor-not-allowed'

  const resetWelcome = () => {
    localStorage.removeItem('customerflow_welcome_seen')
    showToast('Welcome guide reset. Refresh the page to see it again.')
  }

  const loadSampleData = async () => {
    if (leads.length > 0) {
      showToast('You already have data. Clear it first or just enjoy the app!', 'error')
      return
    }
    
    setLoading(true)
    const sampleLeads = [
      { name: 'Abebe Bikila', email: 'abebe@example.com', company: 'Bikila Trading', source: 'Referral', status: 'new', notes: 'Interested in bulk order next month.' },
      { name: 'Sara Mekonnen', email: 'sara@example.com', company: 'Sara Boutique', source: 'Website', status: 'contacted', notes: 'Called on Monday, asked for the new catalog.' },
      { name: 'Dawit Tadesse', email: 'dawit@example.com', company: 'Tadesse Construction', source: 'LinkedIn', status: 'converted', notes: 'Signed the contract for 50 units!' },
      { name: 'Hanna Berhane', email: 'hanna@example.com', company: 'Selam Cafe', source: 'Social media', status: 'new', notes: 'Wants to upgrade their espresso machine.' },
      { name: 'Kebede Tesfaye', email: 'kebede@example.com', company: 'Kebede Logistics', source: 'Cold email', status: 'contacted', notes: 'Follow up next week about fleet pricing.' }
    ]

    try {
      for (const lead of sampleLeads) {
        await api.post('/leads', lead)
      }
      reload()
      showToast('Sample data loaded successfully!')
    } catch (e) {
      showToast('Failed to load sample data.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-up py-4">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <User className="size-6 text-indigo-600" /> Settings
        </h1>
        <p className="text-sm text-slate-500">Manage your profile, app preferences, and data.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><User className="size-5 text-slate-400" /> Your Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
              <input className={field} value={user?.name ?? ''} disabled readOnly />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input className={field} value={user?.email ?? ''} disabled readOnly />
            </div>
            <p className="text-xs text-slate-400 italic">Profile editing will be available in the next update.</p>
          </div>
        </section>

        {/* App Preferences */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="size-5 text-slate-400" /> App Guide</h2>
          <p className="text-sm text-slate-500 mb-4">Want to see the beautiful welcome tutorial again?</p>
          <Button onClick={resetWelcome} className="w-full justify-start border-slate-200 text-slate-700 hover:bg-slate-50">
            <RotateCcw className="mr-2 size-4" /> Reset Welcome Guide
          </Button>
        </section>

        {/* Developer Tools */}
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center gap-2"><Database className="size-5 text-indigo-500" /> Sample Data</h2>
          <p className="text-sm text-indigo-700/80 mb-4 max-w-2xl">
            New to the app? Click below to automatically generate 5 sample customers. This will let you see how your dashboard, tables, and charts look when they are full of data.
          </p>
          <Button onClick={loadSampleData} disabled={loading} variant="primary" className="bg-indigo-600 text-white shadow-md">
            {loading ? 'Generating...' : 'Load 5 Sample Customers'}
          </Button>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold text-rose-700 mb-2 flex items-center gap-2"><ShieldAlert className="size-5" /> Danger Zone</h2>
          <p className="text-sm text-slate-500 mb-4">Sign out of CustomerFlow on this device.</p>
          <Button onClick={logout} className="border-rose-200 text-rose-700 hover:bg-rose-50">
            <LogOut className="mr-2 size-4" /> Sign Out
          </Button>
        </section>
      </div>
    </div>
  )
}
