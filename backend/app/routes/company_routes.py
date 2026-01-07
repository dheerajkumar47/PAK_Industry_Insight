from fastapi import APIRouter
from ..database import db
from ..schemas.company_schema import CompanySchema

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.post("")
def add_company(company: CompanySchema):
    db.companies.insert_one(company.dict())
    return {"message": "Company added successfully"}

from ..utils.seed_tickers import seed_initial_tickers

@router.post("/admin/seed")
def trigger_seed():
    """
    Triggers the manual seeding of top 15 companies.
    """
    seed_initial_tickers()
    return {"message": "Seeding process initiated"}

from bson import ObjectId
from fastapi import HTTPException

@router.get("")
def list_companies(industry: str = None, location: str = None, growth: str = None):
    query = {}
    if industry:
        query["industry"] = industry
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    if growth:
        query["growth_tags"] = growth
    
    companies = list(db.companies.find(query))
    for company in companies:
        company["id"] = str(company["_id"])
        del company["_id"]
    return companies

@router.get("/search")
def search_companies(q: str):
    query = {"name": {"$regex": q, "$options": "i"}}
    companies = list(db.companies.find(query))
    for company in companies:
        company["id"] = str(company["_id"])
        del company["_id"]
    return companies

@router.get("/{company_id}")
def get_company(company_id: str):
    if not ObjectId.is_valid(company_id):
        raise HTTPException(status_code=400, detail="Invalid company ID")
    
    company = db.companies.find_one({"_id": ObjectId(company_id)})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company["id"] = str(company["_id"])
    del company["_id"]
    return company
