from fastapi import APIRouter
from ..database import db
from ..services.aggregator import fetch_news

router = APIRouter(prefix="/news", tags=["News"])

@router.get("/fetch")
def trigger_fetch():
    return fetch_news()

@router.get("/")
def list_news(skip: int = 0, limit: int = 10, sort: str = "latest", smart_filter: bool = False):
    query = {}
    
    # Smart Filter Logic
    if smart_filter:
        query["$or"] = [
            {"relevance_score": {"$gte": 7}},
            {"category": {"$nin": ["Uncategorized", "Other", None]}}
        ]

    if sort == "random":
        pipeline = [{"$match": query}, {"$sample": {"size": limit}}]
        articles = list(db.articles.aggregate(pipeline))
    else:
        # Sort by published_date descending (Latest first)
        articles = list(db.articles.find(query).sort("published_date", -1).skip(skip).limit(limit))
    
    # Convert _id to string if present
    for article in articles:
        if "_id" in article:
            article["id"] = str(article["_id"])
            del article["_id"]
            
    return articles

@router.get("/stats")
def get_stats():
    total_articles = db.articles.count_documents({})
    sources = db.articles.distinct("source")
    source_counts = {}
    for source in sources:
        source_counts[source] = db.articles.count_documents({"source": source})
        
    return {
        "total_sources": len(sources),
        "total_articles": total_articles,
        "source_counts": source_counts
    }
