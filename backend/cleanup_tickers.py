import sys
import os
sys.path.append(os.getcwd())
from backend.app.database import db
import asyncio

BAD_TICKERS = ['ENGRO.KA', 'FFBL.KA', 'JDW.KA', 'PSMC.KA', 'PUNJ.KA', 'RAFHAN.KA', 'ACPL.KA']

def cleanup():
    print(f"Removing {len(BAD_TICKERS)} problematic tickers...")
    result = db.companies.delete_many({'ticker': {'$in': BAD_TICKERS}})
    print(f"Deleted {result.deleted_count} documents.")

if __name__ == "__main__":
    cleanup()
