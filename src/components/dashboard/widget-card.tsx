'use client'

import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { Widget } from '@/types/widget'
import { WeatherWidget } from '@/components/widgets/weather/weather-widget'
import { RssWidget } from '@/components/widgets/rss/rss-widget'
import { TwitterWidget } from '@/components/widgets/twitter/twitter-widget'
import { RedditWidget } from '@/components/widgets/reddit/reddit-widget'
import { NewsWidget } from '@/components/widgets/news/news-widget'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface WidgetCardProps {
  widget: Widget
  onMove: (dragId: string, hoverId: string) => void
}

export function WidgetCard({ widget, onMove }: WidgetCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'WIDGET',
    item: { id: widget.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'WIDGET',
    hover(item: { id: string }) {
      if (item.id !== widget.id) {
        onMove(item.id, widget.id)
      }
    },
  })

  drag(drop(ref))

  const gridArea = `${widget.y + 1} / ${widget.x + 1} / span ${widget.h} / span ${
    widget.w
  }`

  return (
    <Card
      ref={ref}
      className={cn(
        'cursor-move transition-opacity',
        isDragging ? 'opacity-50' : 'opacity-100'
      )}
      style={{ gridArea }}
    >
      <CardHeader>
        <CardTitle className="text-lg">{widget.title}</CardTitle>
        <CardDescription>Drag to reposition</CardDescription>
      </CardHeader>
      <CardContent>
        {widget.type === 'weather' && <WeatherWidget city={widget.content?.city} />}
        {widget.type === 'rss' && (
          <RssWidget
            feedUrl={widget.content?.feedUrl}
            maxItems={widget.content?.maxItems}
          />
        )}
        {widget.type === 'twitter' && (
          <TwitterWidget
            username={widget.content?.username}
            maxTweets={widget.content?.maxTweets}
          />
        )}
        {widget.type === 'reddit' && (
          <RedditWidget
            subreddit={widget.content?.subreddit}
            maxPosts={widget.content?.maxPosts}
          />
        )}
        {widget.type === 'news' && (
          <NewsWidget
            category={widget.content?.category}
            maxArticles={widget.content?.maxArticles}
          />
        )}
      </CardContent>
    </Card>
  )
}