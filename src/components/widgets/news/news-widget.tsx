'use client'

import { Newspaper, Loader2, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNewsFeed } from '@/hooks/use-news-feed'
import Image from 'next/image'

interface NewsWidgetProps {
  category: string
  maxArticles?: number
}

export function NewsWidget({ category, maxArticles = 5 }: NewsWidgetProps) {
  const { data, loading, error } = useNewsFeed(category)

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
          <p className="text-sm">Unable to load news</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          {category.charAt(0).toUpperCase() + category.slice(1)} News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {data?.articles.slice(0, maxArticles).map((article, index) => (
              <article key={index} className="space-y-2">
                {article.urlToImage && (
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium hover:text-primary"
                >
                  {article.title}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{article.source}</span>
                  <time>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}