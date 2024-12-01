import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const subreddit = searchParams.get('subreddit')

  if (!subreddit) {
    return NextResponse.json(
      { error: 'Subreddit parameter is required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json?limit=25`,
      {
        headers: {
          'User-Agent': 'Swizil/1.0.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Reddit API request failed')
    }

    const data = await response.json()
    const posts = data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      url: `https://reddit.com${child.data.permalink}`,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
    }))

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Reddit API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Reddit posts' },
      { status: 500 }
    )
  }
}