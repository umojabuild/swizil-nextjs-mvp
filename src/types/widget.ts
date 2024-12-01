export type WidgetType = 'social' | 'rss' | 'weather' | 'news' | 'twitter' | 'reddit' | 'news'

export interface Widget {
  id: string
  type: WidgetType
  title: string
  x: number
  y: number
  w: number
  h: number
  content?: any
}

export interface WidgetLayoutState {
  widgets: Widget[]
}