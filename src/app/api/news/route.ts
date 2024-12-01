import { NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEWS_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'technology'

  if (!NEWS_API_KEY) {
    return NextResponse.json(
      { error: 'News API key not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(
        category
      )}&language=en&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      throw new Error('News API request failed')
    }

    const data = await response.json()
    const articles = data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
      urlToImage: article.urlToImage,
    }))

    return NextResponse.json({ articles })
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    )
  }
}