'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface TwitterAuthor {
  id: string
  name: string
  username: string
  profile_image_url: string
}

interface Tweet {
  id: string
  text: string
  created_at: string
  author: TwitterAuthor
  reply_count: number
  retweet_count: number
  like_count: number
}

interface TwitterFeed {
  tweets: Tweet[]
}

export function useTwitterFeed(username: string) {
  const [data, setData] = useState<TwitterFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTweets() {
      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from('cache')
          .select('cached_data, expires_at')
          .eq('content_id', `twitter_${username}`)
          .single()

        if (
          cachedData &&
          new Date(cachedData.expires_at) > new Date() &&
          !cacheError
        ) {
          setData(cachedData.cached_data as TwitterFeed)
          setLoading(false)
          return
        }

        const response = await fetch(
          `/api/twitter?username=${encodeURIComponent(username)}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch tweets')
        }

        const twitterData: TwitterFeed = await response.json()
        setData(twitterData)

        await supabase.from('cache').upsert({
          content_id: `twitter_${username}`,
          cached_data: twitterData,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
          created_at: new Date().toISOString(),
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchTweets()
  }, [username])

  return { data, loading, error }
}