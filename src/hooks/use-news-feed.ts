'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  urlToImage?: string
}

interface NewsFeed {
  articles: NewsArticle[]
}

export function useNewsFeed(category: string) {
  const [data, setData] = useState<NewsFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from('cache')
          .select('cached_data, expires_at')
          .eq('content_id', `news_${category}`)
          .single()

        if (
          cachedData &&
          new Date(cachedData.expires_at) > new Date() &&
          !cacheError
        ) {
          setData(cachedData.cached_data as NewsFeed)
          setLoading(false)
          return
        }

        const response = await fetch(
          `/api/news?category=${encodeURIComponent(category)}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }

        const newsData: NewsFeed = await response.json()
        setData(newsData)

        await supabase.from('cache').upsert({
          content_id: `news_${category}`,
          cached_data: newsData,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          created_at: new Date().toISOString(),
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [category])

  return { data, loading, error }
}