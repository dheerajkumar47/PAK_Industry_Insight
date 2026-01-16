from fastapi import APIRouter, HTTPException, BackgroundTasks
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

@router.post("/refresh")
async def refresh_market_data(background_tasks: BackgroundTasks):
    """
    Triggers a background update of all tracked companies via yfinance.
    """
    try:
        background_tasks.add_task(data_engine.update_all_tracked_companies)
        return {"message": "Market data refresh initiated. Changes will reflect shortly."}
    except Exception as e:
        print(f"Error triggering refresh: {e}")
        raise HTTPException(status_code=500, detail="Failed to start refresh")
