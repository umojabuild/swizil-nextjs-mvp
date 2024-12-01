'use client'

import { Twitter, Loader2, MessageCircle, Repeat2, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTwitterFeed } from '@/hooks/use-twitter-feed'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TwitterWidgetProps {
  username: string
  maxTweets?: number
}

export function TwitterWidget({ username, maxTweets = 5 }: TwitterWidgetProps) {
  const { data, loading, error } = useTwitterFeed(username)

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
          <Twitter className="h-8 w-8" />
          <p className="text-sm">Unable to load tweets</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Twitter className="h-5 w-5" />
          Twitter Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {data?.tweets.slice(0, maxTweets).map((tweet) => (
              <article key={tweet.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={tweet.author.profile_image_url} />
                    <AvatarFallback>
                      {tweet.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tweet.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{tweet.author.username}
                      </p>
                    </div>
                    <p className="text-sm">{tweet.text}</p>
                    <div className="flex gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {tweet.reply_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="h-4 w-4" />
                        {tweet.retweet_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {tweet.like_count}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}