from pydantic import BaseModel
from typing import List, Optional

class IndustrySchema(BaseModel):
    name: str
    description: Optional[str] = None
    tags: List[str] = []

    class Config:
        orm_mode = True
