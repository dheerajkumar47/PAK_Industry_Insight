import sys
import os
import json
sys.path.append(os.getcwd())
from backend.app.database import db

# Load static data
DATA_FILE = os.path.join(os.getcwd(), "backend/app/data/company_data.json")

def force_update():
    print("Loading static data...")
    with open(DATA_FILE, "r") as f:
        static_db = json.load(f)

    print("Force updating MongoDB with static values...")
    count = 0
    for sector, companies in static_db.items():
        for ticker, data in companies.items():
            # Construct the update payload with all available static fields
            update_fields = {
                "name": data.get("name"),
                "industry": sector, # Use the loop key as industry
                "market_cap": data.get("market_cap"),
                "revenue": data.get("revenue"),
                "employees_count": data.get("employees_count"),
                "founded_year": data.get("founded_year"),
                "ceo": data.get("ceo"),
                "net_profit": data.get("net_profit"),
                "website": data.get("website")
            }
            
            # Remove None values to avoid overwriting existing data with nulls (though static should be truthy)
            update_fields = {k: v for k, v in update_fields.items() if v is not None}
            
            if update_fields:
                result = db.companies.update_one(
                    {"ticker": ticker},
                    {"$set": update_fields},
                    upsert=True
                )
                if result.modified_count > 0 or result.upserted_id:
                    count += 1
                    print(f"Updated {ticker}")

    print(f"✅ Successfully force-updated {count} companies in MongoDB.")

if __name__ == "__main__":
    force_update()
