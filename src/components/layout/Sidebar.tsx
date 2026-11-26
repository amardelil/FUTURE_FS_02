import { BarChart3, CheckSquare, CreditCard, HelpCircle, LayoutDashboard, Settings, Users } from 'lucide-react'
import { useUi } from '@/context/UiContext'
import { BRAND } from '@/lib/copy'
import type { RouteId } from '@/types'

export const NAV_ITEMS: { id: RouteId; label: string; icon: any }[] = [
  { id: 'summary', label: 'Summary', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reminders', label: 'Reminders', icon: CheckSquare },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'plan', label: 'My Plan', icon: CreditCard },
  { id: 'guide', label: 'Help & Guide', icon: HelpCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { route, navigate, sidebarCollapsed, toggleSidebar, mobileNavOpen, setMobileNavOpen } = useUi()

  return (
    <>
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-100 px-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <BarChart3 className="size-4" />
          </span>
          {!sidebarCollapsed && <span className="truncate font-semibold tracking-tight text-slate-900">{BRAND.name}</span>}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const active = route === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { navigate(item.id); setMobileNavOpen(false) }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`size-4 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <button type="button" onClick={toggleSidebar} className="hidden w-full items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:flex">
            <span className="sr-only">Toggle sidebar</span>
            <svg className={`size-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          </button>
        </div>
      </aside>
    </>
  )
}
