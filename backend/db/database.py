# database.py
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./myfridge.db"  

# Engine for the database
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# SessionLocal for synchronous queries
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()  # Create a session
    try:
        yield db
    finally:
        db.close()  # Ensure the session is closed

# Create tables in the database
def create_db():
    Base.metadata.create_all(bind=engine)
