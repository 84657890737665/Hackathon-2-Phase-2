# backend/src/db/init_db.py

from sqlmodel import SQLModel
from sqlalchemy import create_engine
from .database import DATABASE_URL
from ..models.user import User  # Import all models here for Alembic to detect them
from ..models.task import Task


def create_db_and_tables():
    """
    Create database tables based on SQLModel models.
    
    This function creates all tables defined in the SQLModel models.
    It should be called during application startup.
    """
    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    print("Database tables created successfully!")


if __name__ == "__main__":
    create_db_and_tables()