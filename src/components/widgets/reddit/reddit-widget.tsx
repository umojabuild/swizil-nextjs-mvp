'use client'

import { MessageSquare, ArrowBigUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRedditFeed } from '@/hooks/use-reddit-feed'

interface RedditWidgetProps {
  subreddit: string
  maxPosts?: number
}

export function RedditWidget({ subreddit, maxPosts = 5 }: RedditWidgetProps) {
  const { data, loading, error } = useRedditFeed(subreddit)

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
          <MessageSquare className="h-8 w-8" />
          <p className="text-sm">Unable to load Reddit posts</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          r/{subreddit}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {data?.posts.slice(0, maxPosts).map((post) => (
              <article key={post.id} className="space-y-2">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-primary"
                >
                  {post.title}
                </a>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ArrowBigUp className="h-4 w-4" />
                    {post.score}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.num_comments}
                  </span>
                  <span>by u/{post.author}</span>
                </div>
              </article>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}