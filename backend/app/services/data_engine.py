import json
import os
import yfinance as yf
from datetime import datetime
from ..database import db

# Load static data from JSON
DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/company_data.json")

def load_static_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"ERROR: Could not load company_data.json: {e}")
        return {}

STATIC_DB = load_static_data()

class DataEngine:
    
    @staticmethod
    def get_static_data(ticker):
        for sector, companies in STATIC_DB.items():
            if ticker in companies:
                data = companies[ticker]
                data['industry'] = sector # Enforce sector from JSON structure
                return data
        return {}

    @staticmethod
    def get_all_tickers():
        tickers = []
        for sector, companies in STATIC_DB.items():
            tickers.extend(companies.keys())
        return tickers

    @staticmethod
    def fetch_company_data(ticker_symbol: str):
        """
        Fetches real-time data for a company using yfinance.
        Merges with static enrichment data from JSON.
        """
        try:
            print(f"DEBUG: Fetching data for {ticker_symbol}...")
            stock = yf.Ticker(ticker_symbol)
            info = stock.info

            # Get static fallback data
            static_data = DataEngine.get_static_data(ticker_symbol)

            # Map yfinance data to our schema, prioritizing live info, falling back to static
            company_data = {
                "name": info.get("longName") or info.get("shortName") or static_data.get("name"),
                "ticker": ticker_symbol,
                "industry": static_data.get("industry") or info.get("industry") or "Other", # Priority to Static JSON
                "description": info.get("longBusinessSummary") or f"{static_data.get('name')} is a leading player in the {static_data.get('industry')} sector.",
                "website": info.get("website") or static_data.get("website"),
                "founded_year": static_data.get("founded_year"), 
                "location": f"{info.get('city', 'Pakistan')}, {info.get('country', 'Pakistan')}",
                "employees_count": info.get("fullTimeEmployees") or static_data.get("employees_count"),
                "revenue": info.get("totalRevenue") or info.get("totalRevenue_ttm") or static_data.get("revenue"), # Live Revenue
                "ceo": static_data.get("ceo"), 
                # Try to get Live Net Profit, fallback to Static
                "net_profit": info.get("netIncomeToCommon") or info.get("netIncome") or static_data.get("net_profit"), 
                "market_cap": info.get("marketCap"), # Keep live
                "price": info.get("currentPrice") or info.get("regularMarketPrice"),
                "change": info.get("regularMarketChange"),
                "change_percent": info.get("regularMarketChangePercent"),
                "volume": info.get("volume") or info.get("regularMarketVolume"),
                "previous_close": info.get("previousClose"),
                "last_updated": datetime.utcnow()
            }
            
            # Fallback if yfinance failed completely but we have static data
            if not company_data["revenue"] and "revenue" in static_data:
                 company_data["revenue"] = static_data["revenue"]

            # Simple check to ensure we got something valid
            if not company_data["name"]:
                print(f"WARN: No name found for {ticker_symbol}")
                return None

            return company_data
        except Exception as e:
            print(f"ERROR: Failed to fetch data for {ticker_symbol}: {e}")
            # Emergency fallback: If access to yfinance fails (e.g. rate limit), return static only
            static_data = DataEngine.get_static_data(ticker_symbol)
            if static_data:
                print(f"WARN: Using PURE STATIC data for {ticker_symbol}")
                return {
                    "name": static_data.get("name"),
                    "ticker": ticker_symbol,
                    "industry": static_data.get("industry"),
                    "description": f"{static_data.get('name')} (Data offline)",
                    "website": static_data.get("website"),
                    "founded_year": static_data.get("founded_year"),
                    "location": "Pakistan",
                    "employees_count": static_data.get("employees_count"),
                    "revenue": 0,
                    "ceo": static_data.get("ceo"),
                    "net_profit": static_data.get("net_profit"),
                    "market_cap": 0,
                    "last_updated": datetime.utcnow()
                }
            return None

    @staticmethod
    async def fetch_live_market_data():
        """
        Aggregates data for Dashboard and AI Service.
        Returns:
          - top_gainers: List of top 30 active stocks.
          - sector_performance: Dict of sector -> avg_change.
        """
        try:
            # 1. Sector Performance
            pipeline = [
                {"$group": {
                    "_id": "$industry",
                    "avg_change": {"$avg": "$change_percent"},
                    "company_count": {"$sum": 1}
                }},
                {"$sort": {"avg_change": -1}}
            ]
            sectors_cursor = db.companies.aggregate(pipeline)
            sector_performance = {}
            for s in sectors_cursor:
                if s["_id"]:
                     sector_performance[s["_id"]] = s["avg_change"] if s["avg_change"] is not None else 0.0

            # 2. Top Stocks (Proxy for Gainers)
            stocks_cursor = db.companies.find(
                {"price": {"$ne": None}}, 
                {"name": 1, "ticker": 1, "industry": 1, "price": 1, "change": 1, "change_percent": 1}
            ).sort("change_percent", -1).limit(30)
            
            top_gainers = []
            for stock in stocks_cursor:
                top_gainers.append({
                    "id": str(stock.get("_id")), 
                    "name": stock.get("name"),
                    "ticker": stock.get("ticker"),
                    "industry": stock.get("industry"),
                    "price": stock.get("price") or 0.0,
                    "change": stock.get("change") or 0.0,
                    "change_percent": (stock.get("change_percent") or 0.0)
                })

            return {
                "sector_performance": sector_performance,
                "top_gainers": top_gainers
            }
        except Exception as e:
            print(f"Error fetching live market data: {e}")
            return {"sector_performance": {}, "top_gainers": []}

    @staticmethod
    def update_company(ticker: str):
        """
        Fetches and updates a single company in the database.
        upsert=True: If it doesn't exist, create it.
        """
        data = DataEngine.fetch_company_data(ticker)
        if data:
            db.companies.update_one(
                {"ticker": ticker},
                {"$set": data},
                upsert=True
            )
            print(f"SUCCESS: Updated {ticker} ({data['name']})")
        return data

    @staticmethod
    def update_all_tracked_companies():
        """
        Finds all companies with a 'ticker' field in DB and updates them.
        """
        tickers = db.companies.distinct("ticker")
        print(f"INFO: Starting daily update for {len(tickers)} companies...")
        for ticker in tickers:
            if ticker:
                DataEngine.update_company(ticker)

data_engine = DataEngine()
