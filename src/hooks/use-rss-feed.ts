'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface RssItem {
  title: string
  link: string
  guid: string
  pubDate: string
  contentSnippet: string
}

interface RssFeed {
  title: string
  description: string
  items: RssItem[]
}

export function useRssFeed(feedUrl: string) {
  const [data, setData] = useState<RssFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchFeed() {
      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from('cache')
          .select('cached_data, expires_at')
          .eq('content_id', `rss_${feedUrl}`)
          .single()

        if (
          cachedData &&
          new Date(cachedData.expires_at) > new Date() &&
          !cacheError
        ) {
          setData(cachedData.cached_data as RssFeed)
          setLoading(false)
          return
        }

        const response = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch RSS feed')
        }

        const feedData: RssFeed = await response.json()
        setData(feedData)

        await supabase.from('cache').upsert({
          content_id: `rss_${feedUrl}`,
          cached_data: feedData,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
          created_at: new Date().toISOString(),
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [feedUrl])

  return { data, loading, error }
}