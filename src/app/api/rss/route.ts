import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser({
  customFields: {
    item: ['contentSnippet'],
  },
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    const feed = await parser.parseURL(url)

    return NextResponse.json({
      title: feed.title,
      description: feed.description,
      items: feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        guid: item.guid || item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    )
  }
}