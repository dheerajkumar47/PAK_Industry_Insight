from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

import certifi

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# Connect to MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where(), tls=True, tlsAllowInvalidCertificates=True)
db = client["PAKIndustryDB"]

# Clear existing data
db.companies.delete_many({})
db.industries.delete_many({})

print("Cleared existing data.")

# Seed Industries
industries = [
    {"name": "Information Technology", "description": "Software development, IT services, and digital solutions", "tags": ["Software", "Services", "Export"]},
    {"name": "Textiles & Apparel", "description": "Manufacturing and export of textile products", "tags": ["Manufacturing", "Export", "Traditional"]},
    {"name": "Agriculture", "description": "Farming, livestock, and agricultural products", "tags": ["Primary", "Traditional", "Essential"]},
    {"name": "Pharmaceuticals", "description": "Drug manufacturing and healthcare products", "tags": ["Healthcare", "Manufacturing", "Growing"]},
    {"name": "Automotive", "description": "Vehicle manufacturing and auto parts", "tags": ["Manufacturing", "Assembly"]},
]

db.industries.insert_many(industries)
print(f"Seeded {len(industries)} industries.")

# Seed Companies
companies = [
    {
        "name": "Systems Limited",
        "industry": "Information Technology",
        "founded_year": 1977,
        "location": "Lahore, Pakistan",
        "employees_count": 5000,
        "growth_tags": ["High Growth", "Top Exporter"],
        "description": "Leading global technology and business process outsourcing service provider.",
        "website": "systemsltd.com",
        "revenue": "$100M+",
        "market_share": "15%",
        "ceo": "Asif Peer",
        "stock_symbol": "SYS",
        "export_markets": ["USA", "Europe", "Middle East"],
        "net_profit": "$25M",
        "certifications": ["ISO 27001", "CMMI Level 5"],
        "products": ["BPO Services", "Cloud Integration", "Data Analytics"]
    },
    {
        "name": "NetSol Technologies",
        "industry": "Information Technology",
        "founded_year": 1996,
        "location": "Lahore, Pakistan",
        "employees_count": 2000,
        "growth_tags": ["Stable", "Product-based"],
        "description": "Global provider of IT and enterprise software solutions primarily for the leasing and finance industry.",
        "website": "netsoltech.com",
        "revenue": "$50M+",
        "market_share": "8%",
        "ceo": "Salim Ghauri",
        "stock_symbol": "NETSOL",
        "export_markets": ["China", "Thailand", "Australia"],
        "net_profit": "$8M",
        "certifications": ["ISO 9001", "CMMI Level 3"],
        "products": ["NFS Ascent", "Leasing Software"]
    },
    {
        "name": "Interloop Limited",
        "industry": "Textiles & Apparel",
        "founded_year": 1992,
        "location": "Faisalabad, Pakistan",
        "employees_count": 25000,
        "growth_tags": ["Large Scale", "Sustainable"],
        "description": "One of the world's largest hosiery manufacturers and a vertically integrated textile company.",
        "website": "interloop-pk.com",
        "revenue": "$300M+",
        "market_share": "12%",
        "ceo": "Navid Fazil",
        "stock_symbol": "ILP",
        "export_markets": ["USA", "EU", "Japan"],
        "net_profit": "$45M",
        "certifications": ["LEED Platinum", "Oeko-Tex"],
        "products": ["Hosiery", "Denim", "Apparel"]
    },
    {
        "name": "Engro Fertilizers",
        "industry": "Agriculture",
        "founded_year": 1965,
        "location": "Karachi, Pakistan",
        "employees_count": 3000,
        "growth_tags": ["Blue Chip", "Essential"],
        "description": "A premier fertilizer manufacturing and marketing company in Pakistan.",
        "website": "engrofertilizers.com",
        "revenue": "$500M+",
        "market_share": "30%",
        "ceo": "Ahsan Zafar Syed",
        "stock_symbol": "EFERT",
        "export_markets": ["Domestic Focus"],
        "net_profit": "$100M",
        "certifications": ["IFA Protect & Sustain"],
        "products": ["Urea", "DAP", "Specialty Fertilizers"]
    },
    {
        "name": "Getz Pharma",
        "industry": "Pharmaceuticals",
        "founded_year": 1995,
        "location": "Karachi, Pakistan",
        "employees_count": 4500,
        "growth_tags": ["Research Driven", "Export Oriented"],
        "description": "The largest pharmaceutical company in Pakistan and a major regional player.",
        "website": "getzpharma.com",
        "revenue": "$200M+",
        "market_share": "10%",
        "ceo": "Khalid Mahmood",
        "stock_symbol": "Private",
        "export_markets": ["Southeast Asia", "Africa", "Central Asia"],
        "net_profit": "$30M",
        "certifications": ["WHO Pre-qualification", "PIC/S"],
        "products": ["Generics", "Biosimilars"]
    },
     {
        "name": "Indus Motor Company",
        "industry": "Automotive",
        "founded_year": 1989,
        "location": "Karachi, Pakistan",
        "employees_count": 3500,
        "growth_tags": ["Market Leader", "Manufacturing"],
        "description": "Manufacturer and distributor of Toyota vehicles in Pakistan.",
        "website": "toyota-indus.com",
        "revenue": "$1B+",
        "market_share": "25%",
        "ceo": "Ali Asghar Jamali",
        "stock_symbol": "INDU",
        "export_markets": ["Domestic Focus"],
        "net_profit": "$80M",
        "certifications": ["ISO 14001"],
        "products": ["Corolla", "Yaris", "Fortuner"]
    }
]

db.companies.insert_many(companies)
print(f"Seeded {len(companies)} companies.")

print("Database seeding completed!")
