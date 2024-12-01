import { NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json(
      { error: 'Username parameter is required' },
      { status: 400 }
    )
  }

  if (!TWITTER_BEARER_TOKEN) {
    return NextResponse.json(
      { error: 'Twitter API token not configured' },
      { status: 500 }
    )
  }

  try {
    const client = new TwitterApi(TWITTER_BEARER_TOKEN)
    const user = await client.v2.userByUsername(username)
    
    if (!user.data) {
      throw new Error('User not found')
    }

    const tweets = await client.v2.userTimeline(user.data.id, {
      expansions: ['author_id'],
      'tweet.fields': ['created_at', 'public_metrics'],
      'user.fields': ['profile_image_url'],
      max_results: 10,
    })

    const formattedTweets = tweets.data.data.map((tweet) => {
      const author = tweets.includes?.users?.find(
        (user) => user.id === tweet.author_id
      )

      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author: {
          id: author?.id,
          name: author?.name,
          username: author?.username,
          profile_image_url: author?.profile_image_url,
        },
        reply_count: tweet.public_metrics?.reply_count || 0,
        retweet_count: tweet.public_metrics?.retweet_count || 0,
        like_count: tweet.public_metrics?.like_count || 0,
      }
    })

    return NextResponse.json({ tweets: formattedTweets })
  } catch (error) {
    console.error('Twitter API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tweets' },
      { status: 500 }
    )
  }
}