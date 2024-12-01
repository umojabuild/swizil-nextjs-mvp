'use client'

import { useEffect, useState } from 'react'
import { CloudRainWind, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeather } from '@/hooks/use-weather'

interface WeatherWidgetProps {
  city?: string
}

export function WeatherWidget({ city = 'London' }: WeatherWidgetProps) {
  const { data, loading, error } = useWeather(city)

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
          <CloudRainWind className="h-8 w-8" />
          <p className="text-sm">Unable to load weather data</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRainWind className="h-5 w-5" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {Math.round(data.temp)}°C
              </p>
              <p className="text-sm text-muted-foreground">{city}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{data.description}</p>
              <p className="text-sm text-muted-foreground">
                H: {Math.round(data.temp_max)}° L: {Math.round(data.temp_min)}°
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Humidity</p>
              <p className="font-medium">{data.humidity}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Wind</p>
              <p className="font-medium">{Math.round(data.wind_speed)} km/h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}