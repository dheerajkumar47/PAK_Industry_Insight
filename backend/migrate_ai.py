from app.database import db
from app.services.ai_service import ai_service
import time

def migrate_ai():
    print("Starting AI Migration for existing articles...")
    
    # Find articles that don't have a category yet
    articles = list(db.articles.find({"category": {"$exists": False}}))
    print(f"Found {len(articles)} articles to analyze.")
    
    count = 0
    for article in articles:
        try:
            print(f"Analyzing [{count+1}/{len(articles)}]: {article['title']}")
            
            # Call AI Service
            analysis = ai_service.analyze_article(article['title'], article['summary'])
            
            if analysis:
                # Update DB
                db.articles.update_one(
                    {"_id": article["_id"]},
                    {"$set": {
                        "category": analysis.get("category", "Uncategorized"),
                        "relevance_score": analysis.get("relevance_score", 0),
                        "tags": analysis.get("tags", [])
                    }}
                )
                print(f"  -> Scored: {analysis.get('relevance_score')}/10 | Category: {analysis.get('category')}")
            else:
                print("  -> Failed to analyze.")
                
            count += 1
            # Sleep briefly to avoid hitting rate limits too hard
            time.sleep(2) 
            
        except Exception as e:
            print(f"Error processing article {article['_id']}: {e}")

    print("Migration complete!")

if __name__ == "__main__":
    migrate_ai()
