export const DEMO_CREDENTIALS = {
  email: 'demo@swizil.com',
  password: 'demo1234',
}

export const DEMO_WIDGETS = [
  {
    id: 'weather-1',
    type: 'weather',
    title: 'Weather',
    x: 0,
    y: 0,
    w: 3,
    h: 2,
    content: {
      city: 'London',
    },
  },
  {
    id: 'news-1',
    type: 'news',
    title: 'Tech News',
    x: 3,
    y: 0,
    w: 6,
    h: 2,
    content: {
      category: 'technology',
      maxArticles: 5,
    },
  },
  {
    id: 'twitter-1',
    type: 'twitter',
    title: 'Twitter Feed',
    x: 9,
    y: 0,
    w: 3,
    h: 2,
    content: {
      username: 'vercel',
      maxTweets: 5,
    },
  },
]