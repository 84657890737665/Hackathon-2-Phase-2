from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy import event
from sqlalchemy.engine import Engine
import os
from typing import Generator
from contextlib import contextmanager


# Get database URL from environment variable
# For development, use SQLite; for production, use PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require")


# Validate database URL format
if not DATABASE_URL.startswith(('postgresql://', 'sqlite://')):
    raise ValueError("Invalid database URL. Must start with postgresql:// or sqlite://")

# Create the engine with connection pooling settings
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    echo=False  # Disable SQL logging in production
)


def get_session() -> Generator[Session, None, None]:
    """
    Get a database session.
    
    Yields:
        Session: A SQLModel session for database operations
    """
    with Session(engine) as session:
        yield session


@contextmanager
def get_session_context():
    """
    Context manager for database sessions.
    
    Usage:
        with get_session_context() as session:
            # Perform database operations
            pass
    """
    session = Session(engine)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def create_db_and_tables():
    """
    Create database tables.
    
    This function creates all tables defined in the SQLModel models.
    It should be called during application startup.
    """
    # Import all models to ensure they're registered with SQLModel metadata
    from src.models.user import User
    from src.models.task import Task
    from src.models.achievement import Achievement, UserAchievement
    from src.models.task_completion import TaskCompletion
    
    # Create all tables
    SQLModel.metadata.create_all(engine)