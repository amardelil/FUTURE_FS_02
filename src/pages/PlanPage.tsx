import { useState, useEffect } from 'react'
import { useCrm } from '@/context/CrmContext'
import { Target, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PlanPage() {
  const { leads } = useCrm()
  const [targetCustomers, setTargetCustomers] = useState(10)
  const [targetCalls, setTargetCalls] = useState(20)

  // Load saved targets from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crm_targets')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.customers) setTargetCustomers(parsed.customers)
      if (parsed.calls) setTargetCalls(parsed.calls)
    }
  }, [])

  const saveTargets = () => {
    localStorage.setItem('crm_targets', JSON.stringify({ customers: targetCustomers, calls: targetCalls }))
    alert('Your personal plan has been saved!')
  }

  // Calculate progress
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  
  const wonThisWeek = leads.filter(l => 
    l.status === 'converted' && new Date(l.updatedAt) >= startOfWeek
  ).length

  const contactedThisWeek = leads.filter(l => 
    l.status === 'contacted' && new Date(l.updatedAt) >= startOfWeek
  ).length

  const customerProgress = Math.min((wonThisWeek / targetCustomers) * 100, 100)
  const callProgress = Math.min((contactedThisWeek / targetCalls) * 100, 100)

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-up py-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">My Personal Business Plan</h1>
        <p className="mt-2 text-slate-500">Set your own weekly targets and track your progress automatically.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Set Targets */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Target className="size-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Set Your Goals</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Customers I want to win this week</label>
              <input 
                type="number" 
                value={targetCustomers} 
                onChange={e => setTargetCustomers(Number(e.target.value))}
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm focus:border-indigo-600" 
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">People I want to call this week</label>
              <input 
                type="number" 
                value={targetCalls} 
                onChange={e => setTargetCalls(Number(e.target.value))}
                className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm focus:border-indigo-600" 
              />
            </div>
            <Button onClick={saveTargets} className="w-full bg-indigo-600 text-white">Save My Plan</Button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 shadow-xl text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="size-5" />
            </div>
            <h2 className="text-lg font-semibold">This Week's Progress</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">Customers Won</span>
                <span className="font-bold text-white">{wonThisWeek} / {targetCustomers}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-700">
                <div className="h-2 rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${customerProgress}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">People Contacted</span>
                <span className="font-bold text-white">{contactedThisWeek} / {targetCalls}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-700">
                <div className="h-2 rounded-full bg-indigo-400 transition-all duration-500" style={{ width: `${callProgress}%` }}></div>
              </div>
            </div>
          </div>

          {customerProgress >= 100 && (
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-500/20 p-3 text-sm text-emerald-300">
              <CheckCircle2 className="size-5" /> Amazing! You hit your customer goal for this week.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
