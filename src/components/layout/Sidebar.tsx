import { BarChart3, CalendarCheck, ChevronsLeft, ChevronsRight, LayoutDashboard, Settings, Users, X, type LucideIcon } from 'lucide-react'
import { useUi } from '@/context/UiContext'
import type { RouteId } from '@/types'

export const NAV_ITEMS: { id: RouteId; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'followups', label: 'Follow-ups', icon: CalendarCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white" aria-hidden="true">
        <BarChart3 className="size-4" />
      </span>
      {!collapsed && <span className="text-[15px] font-semibold tracking-tight text-slate-900">LeadFlow</span>}
    </div>
  )
}

function NavList({ collapsed }: { collapsed: boolean }) {
  const { route } = useUi()
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5 px-3 py-3">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = route === id
        return (
          <a
            key={id}
            href={`#/${id}`}
            title={collapsed ? label : undefined}
            aria-current={active ? 'page' : undefined}
            className={`flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium ${collapsed ? 'justify-center' : ''} ${
              active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {collapsed ? <span className="sr-only">{label}</span> : label}
          </a>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileNavOpen, setMobileNavOpen } = useUi()
  return (
    <>
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white lg:flex ${sidebarCollapsed ? 'w-16' : 'w-60'}`}>
        <div className={`flex h-14 items-center border-b border-slate-200 ${sidebarCollapsed ? 'justify-center' : 'px-5'}`}><Brand collapsed={sidebarCollapsed} /></div>
        <NavList collapsed={sidebarCollapsed} />
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`mx-3 mt-auto mb-3 flex h-9 items-center gap-3 rounded-md px-2.5 text-sm text-slate-500 hover:bg-slate-100 ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          {sidebarCollapsed ? <ChevronsRight className="size-4" /> : <><ChevronsLeft className="size-4" />Collapse</>}
        </button>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
          <aside className="relative flex w-64 flex-col bg-white shadow-xl" aria-label="Navigation menu">
            <div className="flex h-14 items-center justify-between border-b border-slate-200 px-5">
              <Brand collapsed={false} />
              <button type="button" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"><X className="size-4" /></button>
            </div>
            <NavList collapsed={false} />
          </aside>
        </div>
      )}
    </>
  )
}
