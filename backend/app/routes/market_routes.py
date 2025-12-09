from fastapi import APIRouter
from ..services.market_service import market_service

router = APIRouter(prefix="/market", tags=["Market"])

@router.get("/live")
def get_live_market():
    """
    Get live market data including stock prices, currency rates, and sector performance
    """
    return market_service.get_live_market_data()
