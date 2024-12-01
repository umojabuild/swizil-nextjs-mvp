'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface WeatherData {
  temp: number
  temp_min: number
  temp_max: number
  humidity: number
  wind_speed: number
  description: string
}

export function useWeather(city: string) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const { data: cachedData, error: cacheError } = await supabase
          .from('cache')
          .select('cached_data, expires_at')
          .eq('content_id', `weather_${city}`)
          .single()

        if (
          cachedData &&
          new Date(cachedData.expires_at) > new Date() &&
          !cacheError
        ) {
          setData(cachedData.cached_data as WeatherData)
          setLoading(false)
          return
        }

        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch weather data')
        }

        const weatherData: WeatherData = await response.json()
        setData(weatherData)

        // Cache the weather data
        await supabase.from('cache').upsert({
          content_id: `weather_${city}`,
          cached_data: weatherData,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
          created_at: new Date().toISOString(),
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  return { data, loading, error }
}