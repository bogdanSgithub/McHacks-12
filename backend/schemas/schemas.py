# schemas.py
from email.mime import image
from pydantic import BaseModel

class ItemCreate(BaseModel):
    name: str
    weight: str
    expiration_date: str
    image: str
    brand: str

class ItemResponse(ItemCreate):
    id: int

    class Config:
        orm_mode = True  
