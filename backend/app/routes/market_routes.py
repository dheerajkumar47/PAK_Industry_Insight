from fastapi import APIRouter, HTTPException
from ..database import db
from ..services.data_engine import data_engine
from datetime import datetime

router = APIRouter()

@router.get("/live")
async def get_market_trends():
    """
    Returns aggregated market data for the trends page.
    - Currency (USD/PKR) - Mocked or fetched if possible
    - Sector Performance (Avg change %)
    - Top Stocks (Gainers/Losers mixed)
    """
    try:
        data = await data_engine.fetch_live_market_data()
        
        # 3. Currency (Mock for now or store in DB)
        currency = {
            "pair": "USD/PKR",
            "rate": 278.50, # Static fallback
            "change": 1.2,
            "change_percent": 0.45
        }

        # Merge currency into the response
        data["currency"] = currency
        return data

    except Exception as e:
        print(f"Error in market trends: {e}")
        raise HTTPException(status_code=500, detail=str(e))
