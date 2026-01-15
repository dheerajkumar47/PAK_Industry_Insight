import yfinance as yf
from typing import Dict, List, Any
from ..database import db
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from datetime import datetime, timedelta

class MarketService:
    """
    Service responsible for fetching LIVE market data from the Yahoo Finance API (yfinance).
    
    Why this exists:
    - The database (Mongo) stores static info (Company name, industry).
    - This service enriches that data with Real-Time Prices, Volume, and Change metrics.
    
    Key Features:
    - **Parallel Processing**: Uses logic to fetch 100+ stocks concurrently (Threadpool).
    - **Caching/Timeouts**: Prevents the UI from hanging if Yahoo Finance is slow.
    - **Aggregations**: Calculates "Sector Performance" on the fly based on individual stock movements.
    """
    
    @staticmethod
    def fetch_stock_data(company: Dict) -> Dict[str, Any]:
        """
        Worker function to fetch data for a SINGLE stock.
        
        Args:
            company (Dict): A dictionary containing at least 'ticker' and 'industry'.
            
        Returns:
            Dict: Enriched stock data (Price, Change, Market Cap, Volume). Returns None if fetch fails.
            
        Logic:
            1. Tries to get `regularMarketPrice` (Live Price).
            2. Tries to get `previousClose` to calculate daily change %.
            3. Fallback: If `previousClose` is missing (common in yfinance), fetches 2-day history to manually calculate it.
        """
        ticker = company.get("ticker")
        if not ticker:
            return None
            
        try:
            stock = yf.Ticker(ticker)
            
            # Get current price from info
            info = stock.info
            if not info or 'regularMarketPrice' not in info:
                return None
                
            current_price = info.get('regularMarketPrice', 0)
            
            # Try to get previous close from info first
            prev_close = info.get('previousClose')
            
            # If previousClose is missing or same as current (market closed/bad data), 
            # try to fetch last 2 days of history to manually calculate change
            if not prev_close or prev_close == current_price:
                try:
                    # Use period="2d" instead of "5d" for faster response
                    import warnings
                    with warnings.catch_warnings():
                        warnings.simplefilter("ignore")
                        hist = stock.history(period="2d", timeout=2) # Short timeout
                    if len(hist) >= 2:
                        prev_close = hist['Close'].iloc[-2]
                    elif len(hist) == 1:
                        prev_close = hist['Close'].iloc[0]
                    else:
                        prev_close = current_price
                except Exception:
                    # If history fetch fails, just use current price (shows 0% change)
                    prev_close = current_price
            
            change = current_price - prev_close
            change_percent = (change / prev_close * 100) if prev_close and prev_close != 0 else 0
            
            return {
                "ticker": ticker,
                "name": company.get("name", ""),
                "industry": company.get("industry", "Other"),
                "price": round(current_price, 2),
                "change": round(change, 2),
                "change_percent": round(change_percent, 2),
                "market_cap": info.get('marketCap', 0),
                "volume": info.get('volume', 0)
            }
            
        except Exception as e:
            # Silently fail for individual stocks to not crash the whole dashboard
            print(f"Error fetching {ticker}: {e}")
            return None
    
    @staticmethod
    def get_live_market_data() -> Dict[str, Any]:
        """
        Main function called by the API to get the full dashboard payload.
        
        Returns:
             Dict with:
             - stocks: List of individual stock data.
             - sectors: List of average performance per industry.
             - currency: Current USD/PKR rate.
             
        Performance Optimization:
             - Uses `ThreadPoolExecutor` with 15 workers.
             - Sets a hard 5-second timeout per stock to ensure the request returns quickly.
        """
        try:
            # Get all companies from database (Static list)
            companies = list(db.companies.find({}, {"ticker": 1, "name": 1, "industry": 1}))
            
            stock_data = []
            sector_performance = {}
            
            # Fetch stocks in parallel
            with ThreadPoolExecutor(max_workers=15) as executor:
                future_to_company = {
                    executor.submit(MarketService.fetch_stock_data, company): company 
                    for company in companies
                }
                
                for future in as_completed(future_to_company):
                    company = future_to_company[future]
                    try:
                        # Give each individual stock 5 seconds max
                        stock_info = future.result(timeout=5)
                        if stock_info:
                            stock_data.append(stock_info)
                            
                            # Aggregate by sector for "Sector Performance" chart
                            sector = stock_info["industry"]
                            if sector not in sector_performance:
                                sector_performance[sector] = {
                                    "total_change": 0,
                                    "count": 0,
                                    "companies": []
                                }
                            
                            sector_performance[sector]["total_change"] += stock_info["change_percent"]
                            sector_performance[sector]["count"] += 1
                            sector_performance[sector]["companies"].append(stock_info["name"])
                    except TimeoutError:
                        print(f"Timeout fetching {company.get('ticker')}")
                    except Exception as e:
                        print(f"Error processing {company.get('ticker')}: {e}")
            
            # Calculate average sector performance
            sector_summary = []
            for sector, data in sector_performance.items():
                avg_change = data["total_change"] / data["count"] if data["count"] > 0 else 0
                sector_summary.append({
                    "sector": sector,
                    "avg_change": round(avg_change, 2),
                    "company_count": data["count"],
                    "companies": data["companies"]
                })
            
            # Sort sectors: Winners first
            sector_summary.sort(key=lambda x: x["avg_change"], reverse=True)
            
            # Fetch USD/PKR exchange rate (Critical for Pakistan context)
            currency_data = {}
            try:
                pkr = yf.Ticker("PKR=X")
                pkr_info = pkr.info
                if pkr_info and 'regularMarketPrice' in pkr_info:
                    current_rate = pkr_info.get('regularMarketPrice', 0)
                    prev_rate = pkr_info.get('previousClose', current_rate)
                    
                    if not prev_rate or prev_rate == current_rate:
                        try:
                             # Fallback history fetch
                            hist = pkr.history(period="2d", timeout=2)
                            if len(hist) >= 2:
                                prev_rate = hist['Close'].iloc[-2]
                        except:
                            pass
                    
                    rate_change = current_rate - prev_rate
                    rate_change_percent = (rate_change / prev_rate * 100) if prev_rate else 0
                    
                    currency_data = {
                        "pair": "USD/PKR",
                        "rate": round(current_rate, 2),
                        "change": round(rate_change, 2),
                        "change_percent": round(rate_change_percent, 2)
                    }
            except Exception as e:
                print(f"Error fetching PKR: {e}")
                currency_data = {
                    "pair": "USD/PKR",
                    "rate": 280.15,  # Fallback manual rate if API fails
                    "change": 0,
                    "change_percent": 0
                }
            
            # Sort stocks by market cap (Biggest companies first)
            stock_data.sort(key=lambda x: x.get("market_cap", 0), reverse=True)
            
            return {
                "stocks": stock_data,
                "currency": currency_data,
                "sectors": sector_summary,
                "total_stocks": len(stock_data)
            }
            
        except Exception as e:
            print(f"Error in get_live_market_data: {e}")
            return {
                "stocks": [],
                "currency": {},
                "sectors": [],
                "total_stocks": 0,
                "error": str(e)
            }

market_service = MarketService()
