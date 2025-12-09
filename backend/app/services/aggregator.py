from ..database import db
from datetime import datetime
import time
import feedparser

RSS_FEEDS = [
    "https://techjuice.pk/feed/",
    "https://propakistani.pk/category/tech-and-telecom/feed/",
    "https://profit.pakistantoday.com.pk/feed/",
    "https://www.dawn.com/feeds/business",
    "https://tribune.com.pk/feed/business",
    "https://news.google.com/rss/search?q=site:mettisglobal.news",
    "https://www.brecorder.com/feeds/latest-news"
]

def clean_source_name(feed_title, feed_url):
    # Check URL first as it's more reliable
    url_lower = feed_url.lower()
    
    if "propakistani" in url_lower:
        return "ProPakistani"
    if "techjuice" in url_lower:
        return "TechJuice"
    if "profit" in url_lower:
        return "Profit"
    if "dawn" in url_lower:
        return "Dawn News"
    if "tribune" in url_lower:
        return "The Express Tribune"
    if "mettisglobal" in url_lower:
        return "Mettis Global"
    if "brecorder" in url_lower:
        return "Business Recorder"
        
    # Fallback: Use title but clean it
    return feed_title.split(" - ")[0].split(" | ")[0].strip()

def fetch_news():
    articles = []
    new_count = 0
    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            # Use generalized cleaner
            source_name = clean_source_name(feed.feed.title, feed_url)
            
            for entry in feed.entries[:50]:  # Get top 50 from each
                # Parse date
                published_date = datetime.utcnow()
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    published_date = datetime.fromtimestamp(time.mktime(entry.published_parsed))
                
                # Check for duplicates
                if db.articles.find_one({"link": entry.link}):
                    continue

                article = {
                    "title": entry.title,
                    "link": entry.link,
                    "published": entry.published, 
                    "published_date": published_date,
                    "summary": entry.summary,
                    "source": source_name,
                    "created_at": datetime.utcnow()
                }
                
                db.articles.insert_one(article)
                articles.append(article)
                new_count += 1
                
        except Exception as e:
            print(f"Error fetching feed {feed_url}: {e}")
    
    if new_count > 0:
        print(f"✓ Saved {new_count} new articles")
    else:
        print("✓ No new articles found")
            
    return {"message": f"Fetched {len(articles)} new articles"}
