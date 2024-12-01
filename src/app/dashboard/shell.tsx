'use client'

import { useWidgetLayout } from '@/hooks/use-widget-layout'
import { WidgetGrid } from '@/components/dashboard/widget-grid'

interface DashboardShellProps {
  userId: string
}

export function DashboardShell({ userId }: DashboardShellProps) {
  const { layout, loading, updateLayout } = useWidgetLayout(userId)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">Swizil</span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <WidgetGrid widgets={layout.widgets} onLayoutChange={updateLayout} />
      </main>
    </div>
  )
}