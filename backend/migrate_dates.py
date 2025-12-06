from app.database import db
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from email.utils import parsedate_to_datetime
from datetime import datetime

load_dotenv()

def migrate_dates():
    print("Migrating dates...")
    articles = db.articles.find({"published_date": {"$exists": False}})
    
    count = 0
    for article in articles:
        try:
            published_str = article.get("published")
            if published_str:
                # Parse RFC 2822 date string
                dt = parsedate_to_datetime(published_str)
                
                # Update document
                db.articles.update_one(
                    {"_id": article["_id"]},
                    {"$set": {"published_date": dt}}
                )
                count += 1
        except Exception as e:
            print(f"Error parsing date for article {article.get('_id')}: {e}")
            
    print(f"Successfully updated {count} articles with published_date.")

if __name__ == "__main__":
    migrate_dates()
