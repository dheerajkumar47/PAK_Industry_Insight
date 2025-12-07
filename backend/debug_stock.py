import yfinance as yf
import json

def debug_stock(ticker):
    print(f"Fetching info for {ticker}...")
    stock = yf.Ticker(ticker)
    info = stock.info
    
    # Save to file to inspect
    with open("stock_debug.json", "w") as f:
        json.dump(info, f, indent=4)
        
    print("Keys found:", info.keys())
    print("\n--- CRITICAL VALUES ---")
    print("longName:", info.get("longName"))
    print("totalRevenue:", info.get("totalRevenue"))
    print("revenue:", info.get("revenue"))  # Check alternate key
    print("fullTimeEmployees:", info.get("fullTimeEmployees"))
    print("officers:", info.get("companyOfficers"))
    print("website:", info.get("website"))
    print("marketCap:", info.get("marketCap"))
    print("industry:", info.get("industry"))

if __name__ == "__main__":
    debug_stock("ENGRO.KA")
