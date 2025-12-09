"""
Import enriched companies to database
Replaces existing companies with enriched data
Run from backend directory: python load_enriched_data.py
"""

import json
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import db

def import_enriched_companies():
    imported_count = 0
    for company in companies:
        # Convert to database schema
        company_doc = {
            "name": company["name"],
            "ticker": company["psx_symbol"],
            "industry": company["sector"],
            "market_cap": company.get("market_cap", ""),
            "revenue": company.get("revenue", ""),
            "employees": company.get("employees", ""),
            "headquarters": company.get("hq", "Pakistan"),
            "website": company.get("website", ""),
            "founded": company.get("founded", ""),
            "description": company.get("description", ""),
            "ceo": company.get("ceo", ""),
        }
        
        # Insert into database
        db.companies.insert_one(company_doc)
        imported_count += 1
    
    print(f"✓ Imported {imported_count} companies successfully")
    
    # Print summary by sector
    print("\nCompanies by Sector:")
    pipeline = [
        {"$group": {"_id": "$industry", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    sectors = list(db.companies.aggregate(pipeline))
    for sector in sectors:
        print(f"  - {sector['_id']}: {sector['count']} companies")
    
    # Count enriched companies (those with CEO data)
    enriched = db.companies.count_documents({"ceo": {"$ne": ""}})
    print(f"\n✓ {enriched} companies have enriched data (CEO, Revenue, etc.)")
    
    print("\n" + "=" * 80)
    print("IMPORT COMPLETE!")
    print(f"Total: {imported_count} companies across {len(sectors)} sectors")
    print(f"Enriched: {enriched} companies with full data")
    print("=" * 80)

if __name__ == "__main__":
    import_enriched_companies()
