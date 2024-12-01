'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Widget, WidgetLayoutState } from '@/types/widget'

export function useWidgetLayout(userId: string) {
  const [layout, setLayout] = useState<WidgetLayoutState>({ widgets: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLayout() {
      try {
        const { data, error } = await supabase
          .from('preferences')
          .select('widget_layout')
          .eq('user_id', userId)
          .single()

        if (error) throw error

        if (data?.widget_layout) {
          setLayout(data.widget_layout as WidgetLayoutState)
        }
      } catch (error) {
        console.error('Error loading widget layout:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLayout()
  }, [userId])

  const updateLayout = async (widgets: Widget[]) => {
    try {
      const { error } = await supabase
        .from('preferences')
        .upsert({
          user_id: userId,
          widget_layout: { widgets },
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setLayout({ widgets })
    } catch (error) {
      console.error('Error updating widget layout:', error)
    }
  }

  return { layout, loading, updateLayout }
}