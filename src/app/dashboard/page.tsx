import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from './shell'

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return <DashboardShell userId={user.id} />
}