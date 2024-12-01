import { NextResponse } from 'next/server'

const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    )
  }

  if (!WEATHER_API_KEY) {
    return NextResponse.json(
      { error: 'Weather API key not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&units=metric&appid=${WEATHER_API_KEY}`
    )

    if (!response.ok) {
      throw new Error('Weather API request failed')
    }

    const data = await response.json()

    return NextResponse.json({
      temp: data.main.temp,
      temp_min: data.main.temp_min,
      temp_max: data.main.temp_max,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}