# schemas.py
from pydantic import BaseModel

class ItemCreate(BaseModel):
    name: str
    weight: str
    expiration_date: str

class ItemResponse(ItemCreate):
    id: int

    class Config:
        orm_mode = True  
