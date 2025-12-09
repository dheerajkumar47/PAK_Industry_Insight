# Data Sources Documentation
## Pakistani Company Database - 79 Companies Across 18 Sectors

### Primary Data Source
**Yahoo Finance API** (via `yfinance` Python library)
- **URL**: https://finance.yahoo.com/
- **API Library**: `yfinance` (https://pypi.org/project/yfinance/)
- **Coverage**: Pakistan Stock Exchange (PSX) listed companies
- **Ticker Format**: `SYMBOL.KA` (e.g., `OGDC.KA`, `HBL.KA`)

### Data Collection Method
1. **Company Tickers**: Manually curated list of PSX-listed companies
2. **Ticker Source**: Pakistan Stock Exchange official website (https://www.psx.com.pk/)
3. **Data Verification**: Each company verified through Yahoo Finance API
4. **Source Links**: Every company includes Yahoo Finance URL as source

### Sector Classification
Sectors are based on **Pakistan Stock Exchange (PSX) official sector classification**:

1. **Energy** (13 companies)
   - Oil & Gas Exploration
   - Power Generation
   - Oil Marketing
   - Gas Distribution

2. **Banking & Financial Services** (10 companies)
   - Commercial Banks (HBL, UBL, MCB, etc.)

3. **Cement** (8 companies)
   - Cement manufacturers

4. **Textile & Apparel** (7 companies)
   - Textile composite mills

5. **Chemicals & Fertilizers** (6 companies)
   - Fertilizer companies
   - Chemical manufacturers

6. **Automotive** (5 companies)
   - Automobile assemblers
   - Auto parts manufacturers

7. **Food & Agriculture** (4 companies)
   - Food processing
   - Beverages

8. **Pharmaceuticals** (4 companies)
   - Pharmaceutical manufacturers

9. **Insurance** (4 companies)
   - General insurance
   - Life insurance

10. **Steel & Materials** (3 companies)
    - Steel manufacturers

11. **Telecom** (3 companies)
    - Telecommunications

12. **Technology** (3 companies)
    - IT services
    - Software development

13. **Paper & Board** (2 companies)
    - Paper manufacturing

14. **Cable & Electrical Goods** (2 companies)
    - Cable manufacturers
    - Electrical equipment

15. **Sugar** (2 companies)
    - Sugar mills

16. **Engineering** (1 company)
    - Heavy machinery

17. **Vanaspati & Allied** (1 company)
    - Cooking oils

18. **Tobacco** (1 company)
    - Tobacco products

### Data Fields Collected
For each company, the following data is collected from Yahoo Finance:

✅ **Always Available:**
- Company Name
- PSX Ticker Symbol
- Sector/Industry
- Market Capitalization
- Source URL (Yahoo Finance link)

### Verification Process
1. ✅ All 79 companies are **PSX-listed** (Pakistani-owned by definition)
2. ✅ All companies have **verified tickers** on Yahoo Finance
3. ✅ All companies include **source links** for verification
4. ✅ Sector mappings match **PSX official classifications**

### Sample Company Data Structure
```json
{
  "name": "Oil and Gas Development Company Limited",
  "sector": "Energy",
  "psx_symbol": "OGDC.KA",
  "market_cap": 567163420672,
  "is_listed": true,
  "sources": ["https://finance.yahoo.com/quote/OGDC.KA"]
}
```

### Data Freshness
- **Market Cap**: Real-time from Yahoo Finance
- **Stock Prices**: 15-minute delayed (Yahoo Finance free tier)
- **Company Info**: Updated periodically by Yahoo Finance

### Limitations
1. Not all 500+ PSX companies are available on Yahoo Finance
2. Only ~150-200 PSX companies have Yahoo Finance coverage
3. Private companies are NOT included (no public financial data)
4. Some fields may be empty if not provided by Yahoo Finance

### Files Generated
1. **companies_expanded.json** - 79 companies with full data
2. **sectors_expanded.json** - 18 sectors with descriptions
3. **Source**: All data from Yahoo Finance API

### Verification Links
You can verify any company by visiting:
`https://finance.yahoo.com/quote/[TICKER]`

Example:
- OGDC: https://finance.yahoo.com/quote/OGDC.KA
- HBL: https://finance.yahoo.com/quote/HBL.KA
- Lucky Cement: https://finance.yahoo.com/quote/LUCK.KA

---

**Last Updated**: December 9, 2024
**Total Companies**: 79
**Total Sectors**: 18
**Data Source**: Yahoo Finance (yfinance Python library)
**Verification**: All companies PSX-listed and Pakistani-owned
