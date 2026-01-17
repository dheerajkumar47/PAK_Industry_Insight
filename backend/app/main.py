from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth_routes, company_routes, industry_routes, news_routes, market_routes, watchlist_routes, ai_routes

from .config import settings

app = FastAPI(title="PAK Industry Insight API")

from apscheduler.schedulers.background import BackgroundScheduler
from .services.data_engine import DataEngine
from .services.ai_service import ai_service

scheduler = BackgroundScheduler()

@app.on_event("startup")
async def startup_event():
    print(f"Startup Config: GOOGLE_CLIENT_ID={settings.GOOGLE_CLIENT_ID[:10]}... (masked)")
    
    # Schedule daily data refresh at midnight (Full Sync - Metadata)
    scheduler.add_job(DataEngine.update_all_tracked_companies, 'cron', hour=0)

    # Schedule fast price updates every 60s (Live Data - Price/Vol)
    scheduler.add_job(DataEngine.update_live_prices, 'interval', seconds=60)
    
    # Schedule AI Analyst every 15 minutes to respect Free Tier Limits
    scheduler.add_job(ai_service.analyze_and_store_pulse, 'interval', seconds=900)
    
    scheduler.start()
    print("INFO: Market Data Scheduler Started (Daily + Live 1m + AI 5m)")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev (fixes port 3001 issue)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend API Working!"}

app.include_router(auth_routes.router)
app.include_router(company_routes.router)
app.include_router(industry_routes.router)
app.include_router(news_routes.router)
app.include_router(market_routes.router, prefix="/market", tags=["Market"])
app.include_router(watchlist_routes.router)
app.include_router(ai_routes.router)
