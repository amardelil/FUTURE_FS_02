import { AppLayout } from '@/components/layout/AppLayout'
import { CrmProvider } from '@/context/CrmContext'
import { UiProvider, useUi } from '@/context/UiContext'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { FollowUpsPage } from '@/pages/FollowUpsPage'
import { LeadsPage } from '@/pages/LeadsPage'
import { OverviewPage } from '@/pages/OverviewPage'
import { SettingsPage } from '@/pages/SettingsPage'

function Routes() {
  const { route } = useUi()
  switch (route) {
    case 'leads': return <LeadsPage />
    case 'followups': return <FollowUpsPage />
    case 'analytics': return <AnalyticsPage />
    case 'settings': return <SettingsPage />
    default: return <OverviewPage />
  }
}

export default function App() {
  return (
    <CrmProvider>
      <UiProvider>
        <AppLayout><Routes /></AppLayout>
      </UiProvider>
    </CrmProvider>
  )
}
