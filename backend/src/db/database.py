from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy import event
from sqlalchemy.engine import Engine
import os
from typing import Generator
from contextlib import contextmanager

# Load environment variables from .env file
from dotenv import load_dotenv
import os

# Get the base directory (backend folder: src/db/.. -> src/.. -> backend)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")

# Try to load from specific path, then from CWD
if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)
else:
    load_dotenv()

# Get database URL from environment variable
# For development, use SQLite; for production, use PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require")


# Validate database URL format
if not DATABASE_URL.startswith(('postgresql://', 'sqlite://')):
    raise ValueError("Invalid database URL. Must start with postgresql:// or sqlite://")

# Create the engine with connection pooling settings
# Configure engine based on database type
connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,
    "echo": False,
}

if DATABASE_URL.startswith("sqlite://"):
    connect_args["check_same_thread"] = False
else:
    # PostgreSQL connection pooling — Neon serverless-friendly settings
    engine_kwargs["pool_size"] = 5
    engine_kwargs["max_overflow"] = 10
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)


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
    from src.models.user import User, UserStatus
    from src.models.task import Task
    from src.models.achievement import Achievement, UserAchievement
    from src.models.task_completion import TaskCompletion
    
    # Create all tables - SQLModel will handle schema creation
    SQLModel.metadata.create_all(engine)
    
    # Handle schema migrations for missing columns (database-agnostic)
    from sqlalchemy import text, inspect
    
    inspector = inspect(engine)
    
    # Check users table columns
    user_columns = [col["name"] for col in inspector.get_columns("users")] if "users" in inspector.get_table_names() else []
    
    if user_columns:
        with engine.connect() as conn:
            missing_user_cols = {
                "status": "VARCHAR DEFAULT 'ACTIVE'",
                "points_balance": "INTEGER DEFAULT 0",
                "streak_count": "INTEGER DEFAULT 0",
                "total_tasks_completed": "INTEGER DEFAULT 0",
                "last_completion_date": "TIMESTAMP",
                "completion_rate": "FLOAT DEFAULT 0.0",
                "execution_velocity": "FLOAT DEFAULT 0.0",
                "focus_consistency": "FLOAT DEFAULT 0.0",
                "collaboration_efficiency": "FLOAT DEFAULT 0.0",
            }
            for col_name, col_type in missing_user_cols.items():
                if col_name not in user_columns:
                    try:
                        conn.execute(text(f'ALTER TABLE "users" ADD COLUMN {col_name} {col_type}'))
                    except Exception:
                        pass  # Column may already exist
            
            conn.commit()
    
    # Check task table columns and constraints
    task_columns = [col["name"] for col in inspector.get_columns("task")] if "task" in inspector.get_table_names() else []
    
    if "task" in inspector.get_table_names():
        with engine.connect() as conn:
            # Fix tags column if missing
            if "tags" not in task_columns:
                try:
                    conn.execute(text('ALTER TABLE task ADD COLUMN tags TEXT'))
                except Exception:
                    pass
            
            # Fix stale foreign key point to 'user' instead of 'users'
            try:
                # Get foreign keys for 'task' table
                fks = inspector.get_foreign_keys("task")
                for fk in fks:
                    if fk["referred_table"] == "user":
                        # Drop stale constraint and add correct one
                        constraint_name = fk["name"]
                        conn.execute(text(f'ALTER TABLE task DROP CONSTRAINT IF EXISTS "{constraint_name}"'))
                        conn.execute(text(f'ALTER TABLE task ADD CONSTRAINT "{constraint_name}" FOREIGN KEY (user_id) REFERENCES users (id)'))
                        print(f"Fixed stale foreign key '{constraint_name}' on 'task' table.")
            except Exception as e:
                print(f"Warning: Failed to fix task foreign keys: {str(e)}")
            
            conn.commit()

    # Similar fix for other tables
    for table_name in ["userachievement", "taskcompletion", "performancemetric"]:
        if table_name in inspector.get_table_names():
            with engine.connect() as conn:
                try:
                    fks = inspector.get_foreign_keys(table_name)
                    for fk in fks:
                        if fk["referred_table"] == "user":
                            constraint_name = fk["name"]
                            conn.execute(text(f'ALTER TABLE "{table_name}" DROP CONSTRAINT IF EXISTS "{constraint_name}"'))
                            conn.execute(text(f'ALTER TABLE "{table_name}" ADD CONSTRAINT "{constraint_name}" FOREIGN KEY (user_id) REFERENCES users (id)'))
                            print(f"Fixed stale foreign key '{constraint_name}' on '{table_name}' table.")
                except Exception as e:
                    pass
                conn.commit()