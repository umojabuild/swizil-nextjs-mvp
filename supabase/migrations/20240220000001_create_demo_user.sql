-- Insert demo user
INSERT INTO users (email, settings)
VALUES ('demo@swizil.com', '{"is_demo": true}'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- Insert demo user preferences with widgets
INSERT INTO preferences (user_id, widget_layout)
SELECT 
  id as user_id,
  '{
    "widgets": [
      {
        "id": "weather-1",
        "type": "weather",
        "title": "Weather",
        "x": 0,
        "y": 0,
        "w": 3,
        "h": 2,
        "content": {
          "city": "London"
        }
      },
      {
        "id": "news-1",
        "type": "news",
        "title": "Tech News",
        "x": 3,
        "y": 0,
        "w": 6,
        "h": 2,
        "content": {
          "category": "technology",
          "maxArticles": 5
        }
      },
      {
        "id": "twitter-1",
        "type": "twitter",
        "title": "Twitter Feed",
        "x": 9,
        "y": 0,
        "w": 3,
        "h": 2,
        "content": {
          "username": "vercel",
          "maxTweets": 5
        }
      }
    ]
  }'::jsonb
FROM users
WHERE email = 'demo@swizil.com'
ON CONFLICT (user_id) DO UPDATE
SET widget_layout = EXCLUDED.widget_layout;