import yfinance as yf
from datetime import datetime
from ..database import db

class DataEngine:
    # Static data to fill gaps where yfinance fails for PSX
    STATIC_ENRICHMENT = {
        "SYS.KA": {
            "founded_year": 1977,
            "website": "www.systemsltd.com",
            "employees_count": 6500,
            "description": "Systems Limited is a leading global technology and business process outsourcing service provider.",
            "revenue": 53000000000, 
            "net_profit": 8500000000, # Approx 8.5B
            "ceo": "Asif Peer",
            "industry": "Technology"
        },
        "ENGRO.KA": {
            "founded_year": 1965,
            "website": "www.engro.com",
            "employees_count": 3500,
            "description": "Engro Corporation is a Pakistani conglomerate with subsidiaries in fertilizers, foods, chemicals, energy, and petrochemicals.",
            "revenue": 450000000000,
            "net_profit": 45000000000, # Approx 45B
            "ceo": "Ghias Khan",
            "industry": "Basic Materials"
        },
        "LUCK.KA": {
            "founded_year": 1993,
            "website": "www.lucky-cement.com",
            "employees_count": 4000,
            "description": "Lucky Cement Limited is the largest cement producer in Pakistan and a leading exporter.",
            "revenue": 100000000000,
            "net_profit": 15000000000, # 15B
            "ceo": "Muhammad Ali Tabba",
            "industry": "Basic Materials"
        },
        "HBL.KA": {
            "founded_year": 1941,
            "website": "www.hbl.com",
            "employees_count": 14000,
            "description": "Habib Bank Limited (HBL) is the largest bank in Pakistan, offering a wide range of banking services.",
            "revenue": 200000000000,
            "net_profit": 35000000000, # 35B
            "ceo": "Muhammad Aurangzeb",
            "industry": "Financial Services"
        },
        "TRG.KA": {
             "founded_year": 2002,
             "website": "www.trgworld.com",
             "employees_count": 5000,
             "description": "TRG Pakistan is a venture capital company focusing on business process outsourcing and technology.",
             "revenue": 5000000000,
             "net_profit": -2000000000, # Loss
             "ceo": "Zia Chishti",
             "industry": "Technology"
        },
        "MCB.KA": {
            "founded_year": 1947,
            "website": "www.mcb.com.pk",
            "employees_count": 12000,
            "description": "MCB Bank Limited is a major Pakistani commercial bank based in Lahore.",
            "revenue": 150000000000,
            "net_profit": 30000000000,
            "ceo": "Shoaib Mumtaz",
            "industry": "Financial Services"
        },
        "UBL.KA": {
            "founded_year": 1959,
            "website": "www.ubldigital.com",
            "employees_count": 10000,
            "description": "United Bank Limited is one of the largest commercial banks in Pakistan.",
            "revenue": 130000000000,
            "net_profit": 28000000000,
            "ceo": "Shazad G. Dada",
            "industry": "Financial Services"
        },
        "HUBC.KA": {
            "founded_year": 1991,
            "website": "www.hubpower.com",
            "employees_count": 800,
            "description": "The Hub Power Company Limited is a large independent power producer in Pakistan.",
            "revenue": 80000000000,
            "net_profit": 20000000000,
            "ceo": "Kamran Kamal",
            "industry": "Energy"
        },
        "OGDC.KA": {
             "founded_year": 1961,
             "website": "www.ogdcl.com",
             "employees_count": 11000,
             "description": "Oil & Gas Development Company Limited is the largest E&P company in Pakistan.",
             "revenue": 300000000000,
             "net_profit": 150000000000, # High profit
             "ceo": "Ahmed Hayat Lak",
             "industry": "Energy"
        },
        "FFC.KA": {
             "founded_year": 1978,
             "website": "www.ffc.com.pk",
             "employees_count": 2500,
             "description": "Fauji Fertilizer Company is the largest urea manufacturer in Pakistan.",
             "revenue": 120000000000,
             "net_profit": 25000000000,
             "ceo": "Sarfaraz Ahmed Rehman",
             "industry": "Basic Materials"
        },
        "PSO.KA": {
            "founded_year": 1976,
            "website": "www.psopk.com",
            "employees_count": 2500,
            "description": "Pakistan State Oil is the largest oil marketing company in Pakistan.",
            "revenue": 2500000000000, # 2.5 Trillion
            "net_profit": 80000000000, # 80B
            "ceo": "Syed Taha",
            "industry": "Energy"
        },
         "INDU.KA": {
             "founded_year": 1989,
             "website": "www.toyota-indus.com",
             "employees_count": 3500,
             "description": "Indus Motor Company Limited assembles and markets Toyota vehicles in Pakistan.",
             "revenue": 180000000000,
             "net_profit": 12000000000,
             "ceo": "Ali Asghar Jamali",
             "industry": "Automobile"
        },
        "MEBL.KA": {
             "founded_year": 1997,
             "website": "www.meezanbank.com",
             "employees_count": 10000,
             "description": "Meezan Bank is the first and largest Islamic bank in Pakistan.",
             "revenue": 190000000000,
             "net_profit": 45000000000,
             "ceo": "Irfan Siddiqui",
             "industry": "Financial Services"
        },
        "MARI.KA": {
            "founded_year": 1983,
            "website": "www.mari.com.pk",
            "employees_count": 1500,
            "description": "Mari Petroleum Company Limited is a large petroleum exploration company.",
             "revenue": 95000000000,
             "net_profit": 35000000000,
             "ceo": "Faheem Haider",
             "industry": "Energy"
        },
        "MTL.KA": {
            "founded_year": 1964,
            "website": "www.millat.com.pk",
            "employees_count": 1200,
            "description": "Millat Tractors Limited manufactures and markets tractors and farm equipment.",
             "revenue": 45000000000,
             "net_profit": 5500000000,
             "ceo": "Raheel Asghar",
             "industry": "Industrials"
        }
    }

    @staticmethod
    def fetch_company_data(ticker_symbol: str):
        """
        Fetches real-time data for a company using yfinance.
        Merges with static enrichment data for missing fields.
        """
        try:
            print(f"DEBUG: Fetching data for {ticker_symbol}...")
            stock = yf.Ticker(ticker_symbol)
            info = stock.info

            # Get static fallback data
            static_data = DataEngine.STATIC_ENRICHMENT.get(ticker_symbol, {})

            # Map yfinance data to our schema, prioritizing live info, falling back to static
            company_data = {
                "name": info.get("longName") or info.get("shortName"),
                "ticker": ticker_symbol,
                "industry": info.get("industry") or static_data.get("industry"), 
                "description": info.get("longBusinessSummary") or static_data.get("description"),
                "website": info.get("website") or static_data.get("website"),
                "founded_year": static_data.get("founded_year"), 
                "location": f"{info.get('city', 'Pakistan')}, {info.get('country', 'Pakistan')}",
                "employees_count": info.get("fullTimeEmployees") or static_data.get("employees_count"),
                "revenue": info.get("totalRevenue") or static_data.get("revenue"),
                "ceo": static_data.get("ceo"), # Added
                "net_profit": static_data.get("net_profit"), # Added
                "market_cap": info.get("marketCap"), # Keep live
                "last_updated": datetime.utcnow()
            }
            
            # Simple check to ensure we got something valid
            if not company_data["name"]:
                print(f"WARN: No name found for {ticker_symbol}")
                return None

            return company_data
        except Exception as e:
            print(f"ERROR: Failed to fetch data for {ticker_symbol}: {e}")
            return None

    @staticmethod
    def update_company(ticker: str):
        """
        Fetches and updates a single company in the database.
        upsert=True: If it doesn't exist, create it.
        """
        data = DataEngine.fetch_company_data(ticker)
        if data:
            # We use ticker as the unique key for upsert
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
