from pydantic import BaseModel
from typing import List, Optional

class CompanySchema(BaseModel):
    name: str
    industry: str
    founded_year: Optional[int] = None
    location: Optional[str] = None
    employees_count: Optional[int] = None
    growth_tags: List[str] = []

    class Config:
        orm_mode = True