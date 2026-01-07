from app.services.data_engine import DataEngine
from app.database import db
import sys

# Force Seed Script
print("--- FORCE SEED STARTING ---")

try:
    tickers = DataEngine.get_all_tickers()
    print(f"Found {len(tickers)} tickers in JSON.")
    
    if len(tickers) == 0:
        print("ERROR: No tickers found! JSON load failed?")
        sys.exit(1)

    print("Clearing DB...")
    result = db.companies.delete_many({})
    print(f"Deleted {result.deleted_count} documents.")

    for i, ticker in enumerate(tickers):
        print(f"[{i+1}/{len(tickers)}] Seeding {ticker}...")
        try:
            DataEngine.update_company(ticker)
        except Exception as e:
            print(f"ERROR updating {ticker}: {e}")

    print("--- FORCE SEED COMPLETE ---")
    
    # Verify count
    count = db.companies.count_documents({})
    print(f"Final DB Count: {count}")

except Exception as e:
    print(f"FATAL ERROR: {e}")
