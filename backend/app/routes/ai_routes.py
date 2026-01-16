from fastapi import APIRouter, HTTPException, Depends
from ..services.ai_service import ai_service
from ..services.data_engine import data_engine
from ..database import db
from bson import ObjectId

router = APIRouter(prefix="/ai", tags=["AI Integration"])

@router.get("/market-pulse")
async def get_market_pulse():
    """
    Generates a Daily Market Summary using AI.
    It fetches the latest news and live market data, then asks Gemeni to summarize it.
    """
    # 1. Try Cached Insight (Proactive AI)
    cached = db.ai_insights.find_one({"_id": "latest_pulse"})
    if cached and cached.get("summary"):
        return {"summary": cached["summary"]}

    # 2. Fallback: Generate Fresh (Reactive)
    try:
        # Get live market snapshot
        market_data = await data_engine.fetch_live_market_data()
        
        # Get latest news headlines from DB
        news_cursor = db.news.find().sort("published_date", -1).limit(6)
        news_headlines = [n.get("title", "") for n in news_cursor]
        
        # Call AI Service
        summary = await ai_service.generate_market_pulse(market_data, news_headlines)
        
        return {"summary": summary}
    except Exception as e:
        print(f"Error in market-pulse: {e}")
        return {"summary": "Unable to generate AI summary at this time."}

@router.get("/company-insight/{company_id}")
async def get_company_insight(company_id: str):
    """
    Generates a SWOT analysis for a specific company.
    """
    if not ObjectId.is_valid(company_id):
        raise HTTPException(status_code=400, detail="Invalid company ID")
        
    company = db.companies.find_one({"_id": ObjectId(company_id)})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    # Prepare context for AI
    name = company.get("name", "Unknown Company")
    industry = company.get("industry", "Unknown Industry")
    desc = company.get("description", "No description available.")
    
    # Call AI
    swot = await ai_service.generate_company_swot(name, industry, desc)
    
    return swot
