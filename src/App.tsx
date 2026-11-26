import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { CrmProvider, useCrm } from '@/context/CrmContext'
import { UiProvider, useUi } from '@/context/UiContext'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AuthPage } from '@/pages/AuthPage'
import { FollowUpsPage } from '@/pages/FollowUpsPage'
import { LeadsPage } from '@/pages/LeadsPage'
import { OverviewPage } from '@/pages/OverviewPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PlanPage } from '@/pages/PlanPage'
import { HelpPage } from '@/pages/HelpPage'
import { WelcomeModal } from '@/components/layout/WelcomeModal'

function Content() {
  const { loading, loadError, reload } = useCrm()
  const { route } = useUi()

  if (loading) return <p role="status" className="py-20 text-center text-sm text-slate-500">Loading your customers…</p>
  if (loadError) {
    return (
      <div role="alert" className="mx-auto flex max-w-sm flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-slate-700">{loadError}</p>
        <Button onClick={reload}>Try again</Button>
      </div>
    )
  }

  switch (route) {
    case 'customers': return <LeadsPage />
    case 'reminders': return <FollowUpsPage />
    case 'reports': return <AnalyticsPage />
    case 'plan': return <PlanPage />
    case 'guide': return <HelpPage />
    case 'settings': return <SettingsPage />
    default: return <OverviewPage />
  }
}

function Gate() {
  const { status, user } = useAuth()
  if (status === 'loading') return <p role="status" className="py-20 text-center text-sm text-slate-500">Loading…</p>
  if (status === 'guest') return <AuthPage />
  return (
    <UiProvider key={user?.id}>
      <CrmProvider>
        <AppLayout>
          <Content />
          <WelcomeModal />
        </AppLayout>
      </CrmProvider>
    </UiProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  )
}
