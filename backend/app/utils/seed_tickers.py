from ..services.data_engine import DataEngine
from ..database import db

def seed_initial_tickers():
    """
    Seeds the top 15 Pakistani companies into the database 
    by triggering an initial fetch for each.
    """
    # Dynamically get all tickers from the static JSON database
    # This ensures seed script is always in sync with our enriched data
    initial_tickers = DataEngine.get_all_tickers()
    
    # Optional: Add any extra manual tickers here if needed, but best to keep it in JSON
    # initial_tickers.extend(["EXTRA.KA"])

    print("--- STARTING SEED PROCESS ---")
    print("INFO: Clearing existing company data...")
    db.companies.delete_many({}) # WIPE ALL DATA
    
    for ticker in initial_tickers:
        DataEngine.update_company(ticker)
    print("--- SEED PROCESS COMPLETE ---")
