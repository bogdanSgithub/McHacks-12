from fastapi import FastAPI, Depends, APIRouter
from sqlalchemy.orm import Session
from db.database import get_db, create_db
from models.item import Item
from schemas.schemas import ItemCreate, ItemResponse
from typing import List

router = APIRouter()

# Initialize the database (create tables if they don’t exist)
create_db()

# Dependency to get the database session

@router.post("/additems/", response_model=List[ItemResponse])
async def add_items(items: List[ItemCreate], db: Session = Depends(get_db)):
    db_items = []
    for item in items:
        db_item = Item(name=item.name, weight=item.weight, expiration_date=item.expiration_date, image=item.image)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        db_items.append(db_item)
    return db_items

@router.get("/items/")
async def read_items(db: Session = Depends(get_db)):
    return db.query(Item).all()

@router.put("/items/{item_id}")
async def update_item(item_id: int, name: str = None, weight: int = None, expiration_date: str = None, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        if name:
            db_item.name = name
        if weight:
            db_item.weight = weight
        if expiration_date:
            db_item.expiration_date = expiration_date
        db.commit()
        db.refresh(db_item)
        return db_item
    return {"error": "Item not found"}

@router.delete("/items/{item_id}")
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return {"message": "Item deleted"}
    return {"error": "Item not found"}
