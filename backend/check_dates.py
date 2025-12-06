from app.database import db
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pprint import pprint

load_dotenv()

def check_dates():
    print("Checking article dates...")
    # Get a mix of articles: some with published_date, some without
    articles = list(db.articles.find({}, {"title": 1, "published": 1, "published_date": 1}).limit(20))
    
    for article in articles:
        pprint(article)

if __name__ == "__main__":
    check_dates()
