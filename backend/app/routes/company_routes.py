from fastapi import APIRouter
from ..database import db
from ..schemas.company_schema import CompanySchema

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.post("/")
def add_company(company: CompanySchema):
    db.companies.insert_one(company.dict())
    return {"message": "Company added successfully"}

@router.get("/")
def list_companies():
    companies = list(db.companies.find({}, {"_id": 0}))
    return companies
