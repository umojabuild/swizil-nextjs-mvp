'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface RedditPost {
  id: string
  title: string
  url: string
  author: string
  score: number
  num_comments: number
  created_utc: number
}

interface RedditFeed {
  posts: RedditPost[]
}

export function useRedditFeed(subreddit: string) {
  const [data, setData] = useState<RedditFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from('cache')
          .select('cached_data, expires_at')
          .eq('content_id', `reddit_${subreddit}`)
          .single()

        if (
          cachedData &&
          new Date(cachedData.expires_at) > new Date() &&
          !cacheError
        ) {
          setData(cachedData.cached_data as RedditFeed)
          setLoading(false)
          return
        }

        const response = await fetch(
          `/api/reddit?subreddit=${encodeURIComponent(subreddit)}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch Reddit posts')
        }

        const redditData: RedditFeed = await response.json()
        setData(redditData)

        await supabase.from('cache').upsert({
          content_id: `reddit_${subreddit}`,
          cached_data: redditData,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
          created_at: new Date().toISOString(),
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [subreddit])

  return { data, loading, error }
}