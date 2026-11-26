import { Bell, LogOut, Menu, Plus, Settings, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCrm } from '@/context/CrmContext'
import { useUi } from '@/context/UiContext'
import { formatDateTime } from '@/lib/format'
import { groupFollowUps } from '@/lib/leads'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Popover } from '@/components/ui/Popover'
import { SearchBar } from '@/components/ui/SearchBar'
import { NAV_ITEMS } from './Sidebar'

export function Header() {
  const { route, navigate, setMobileNavOpen, globalSearch, setGlobalSearch, openLeadForm } = useUi()
  const { leads, followUps } = useCrm()
  const { user, logout } = useAuth()
  const overdue = groupFollowUps(followUps).overdue
  const title = NAV_ITEMS.find((n) => n.id === route)?.label ?? 'Overview'
  const itemClass = 'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button type="button" aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="-ml-1 rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu className="size-5" /></button>
      <h1 className="text-base font-semibold text-slate-900">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <SearchBar
          label="Search leads"
          placeholder="Search leads"
          value={globalSearch}
          onChange={setGlobalSearch}
          onSubmit={() => navigate('leads')}
          className="hidden w-56 sm:block lg:w-72"
        />

        <Popover label="Notifications" width="w-80" trigger={
          <span className="relative flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
            <Bell className="size-[18px]" aria-hidden="true" />
            {overdue.length > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />}
          </span>
        }>
          {(close) => (
            <div>
              <p className="border-b border-slate-100 px-3 py-2 text-sm font-medium text-slate-900">Overdue follow-ups ({overdue.length})</p>
              {overdue.length === 0 && <p className="px-3 py-4 text-sm text-slate-500">You’re all caught up.</p>}
              {overdue.slice(0, 4).map((f) => (
                <button key={f.id} type="button" className={`${itemClass} flex-col items-start gap-0.5`} onClick={() => { navigate('followups'); close() }}>
                  <span className="font-medium">{leads.find((l) => l.id === f.leadId)?.name ?? 'Unknown lead'}</span>
                  <span className="text-xs text-slate-500">{formatDateTime(f.scheduledAt)} · {f.notes}</span>
                </button>
              ))}
            </div>
          )}
        </Popover>

        <Button variant="primary" onClick={() => openLeadForm()} aria-label="Add lead">
          <Plus className="size-4" aria-hidden="true" /><span className="hidden sm:inline">Add lead</span>
        </Button>

        <Popover label="Account menu" trigger={<Avatar name={user?.name ?? ''} />}>
          {(close) => (
            <div>
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button type="button" className={itemClass} onClick={() => { navigate('settings'); close() }}><User className="size-4" />Profile</button>
              <button type="button" className={itemClass} onClick={() => { navigate('settings'); close() }}><Settings className="size-4" />Settings</button>
              <button type="button" className={itemClass} onClick={logout}><LogOut className="size-4" />Sign out</button>
            </div>
          )}
        </Popover>
      </div>
    </header>
  )
}