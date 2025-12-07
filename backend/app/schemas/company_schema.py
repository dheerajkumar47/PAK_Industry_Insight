from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CompanySchema(BaseModel):
    name: str
    ticker: Optional[str] = None
    industry: str
    description: Optional[str] = None
    website: Optional[str] = None
    founded_year: Optional[int] = None
    location: Optional[str] = None
    employees_count: Optional[int] = None
    revenue: Optional[int] = None
    net_profit: Optional[int] = None  # New field
    market_cap: Optional[int] = None
    ceo: Optional[str] = None         # New field
    growth_tags: List[str] = []
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True
