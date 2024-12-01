'use client'

import { Newspaper, Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRssFeed } from '@/hooks/use-rss-feed'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RssWidgetProps {
  feedUrl: string
  maxItems?: number
}

export function RssWidget({ feedUrl, maxItems = 5 }: RssWidgetProps) {
  const { data, loading, error } = useRssFeed(feedUrl)

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Newspaper className="h-8 w-8" />
          <p className="text-sm">Unable to load RSS feed</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          {data?.title || 'RSS Feed'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {data?.items.slice(0, maxItems).map((item) => (
              <article key={item.guid} className="space-y-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium hover:text-primary"
                >
                  {item.title}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.contentSnippet}
                </p>
                <time className="text-xs text-muted-foreground">
                  {new Date(item.pubDate).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}