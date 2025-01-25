# models.py
from sqlalchemy import Column, Integer, String
from db.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    weight = Column(String)
    expiration_date = Column(String)  
