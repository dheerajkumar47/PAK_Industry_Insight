import feedparser
from ..database import db
from datetime import datetime
import time

RSS_FEEDS = [
    "https://techjuice.pk/feed/",
    "https://propakistani.pk/category/tech-and-telecom/feed/"
]

def fetch_news():
    articles = []
    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            feed_title = feed.feed.title
            
            # Custom source name mapping
            if "ProPakistani" in feed_title or "propakistani" in feed_url:
                feed_title = "ProPakistani"
            
            for entry in feed.entries[:50]:  # Get top 50 from each
                # Parse date
                published_date = datetime.utcnow()
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    published_date = datetime.fromtimestamp(time.mktime(entry.published_parsed))
                
                article = {
                    "title": entry.title,
                    "link": entry.link,
                    "published": entry.published, # Keep original string for display if needed
                    "published_date": published_date, # For sorting
                    "summary": entry.summary,
                    "source": feed_title,
                    "created_at": datetime.utcnow()
                }
                
                # Avoid duplicates
                if not db.articles.find_one({"link": article["link"]}):
                    db.articles.insert_one(article)
                    articles.append(article)
        except Exception as e:
            print(f"Error fetching feed {feed_url}: {e}")
            
    return {"message": f"Fetched {len(articles)} new articles"}
