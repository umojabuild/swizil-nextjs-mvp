'use client'

import { useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Widget } from '@/types/widget'
import { WidgetCard } from './widget-card'

interface WidgetGridProps {
  widgets: Widget[]
  onLayoutChange: (widgets: Widget[]) => void
}

export function WidgetGrid({ widgets, onLayoutChange }: WidgetGridProps) {
  const gridStyle = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '1rem',
      padding: '1rem',
    }),
    []
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="min-h-[calc(100vh-4rem)] w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={gridStyle}
      >
        {widgets.map((widget) => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            onMove={(dragId, hoverId) => {
              const newWidgets = [...widgets]
              const dragIndex = widgets.findIndex((w) => w.id === dragId)
              const hoverIndex = widgets.findIndex((w) => w.id === hoverId)
              const [draggedWidget] = newWidgets.splice(dragIndex, 1)
              newWidgets.splice(hoverIndex, 0, draggedWidget)
              onLayoutChange(newWidgets)
            }}
          />
        ))}
      </div>
    </DndProvider>
  )
}