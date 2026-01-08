from fastapi import APIRouter, Depends, HTTPException, status
from ..database import db
from .auth_routes import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

@router.get("")
async def get_watchlist(current_user: dict = Depends(get_current_user)):
    """
    Get all companies in the user's watchlist.
    """
    watchlist_ids = current_user.get("watchlist", [])
    
    if not watchlist_ids:
        return []

    # Convert string IDs to ObjectIds
    object_ids = []
    for wid in watchlist_ids:
        try:
            object_ids.append(ObjectId(wid))
        except:
            continue
            
    companies = list(db.companies.find({"_id": {"$in": object_ids}}))
    
    # Format for response
    for company in companies:
        company["id"] = str(company["_id"])
        del company["_id"]
        
    return companies

@router.post("/{company_id}")
async def add_to_watchlist(company_id: str, current_user: dict = Depends(get_current_user)):
    """
    Add a company to the user's watchlist.
    """
    if not ObjectId.is_valid(company_id):
        raise HTTPException(status_code=400, detail="Invalid company ID")

    # Check if company exists first
    company = db.companies.find_one({"_id": ObjectId(company_id)})
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Add to Set (avoid duplicates)
    db.users.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {"watchlist": company_id}}
    )
    
    return {"message": "Added to watchlist", "company_id": company_id}

@router.delete("/{company_id}")
async def remove_from_watchlist(company_id: str, current_user: dict = Depends(get_current_user)):
    """
    Remove a company from the user's watchlist.
    """
    db.users.update_one(
        {"_id": current_user["_id"]},
        {"$pull": {"watchlist": company_id}}
    )
    
    return {"message": "Removed from watchlist", "company_id": company_id}
