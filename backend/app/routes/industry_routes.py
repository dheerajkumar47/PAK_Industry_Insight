from fastapi import APIRouter
from ..database import db
from ..schemas.industry_schema import IndustrySchema

router = APIRouter(prefix="/industries", tags=["Industries"])

@router.post("/")
def add_industry(industry: IndustrySchema):
    db.industries.insert_one(industry.dict())
    return {"message": "Industry added successfully"}

@router.get("/")
def list_industries():
    industries = list(db.industries.find({}, {"_id": 0}))
    return industries

@router.get("/search")
def search_industries(q: str):
    query = {"name": {"$regex": q, "$options": "i"}}
    industries = list(db.industries.find(query, {"_id": 0}))
    return industries
