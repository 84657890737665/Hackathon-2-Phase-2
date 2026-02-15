# backend/src/models/user.py

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class UserStatus(str, Enum):
    PENDING = "Pending"
    ACTIVE = "Active"
    DISABLED = "Disabled"
    DELETED = "Deleted"

class UserBase(SQLModel):
    """Base model for user with common fields."""
    email: str = Field(unique=True, nullable=False, max_length=255)


class User(UserBase, table=True):
    """User model representing an authenticated user."""
    __tablename__ = "users"
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255)
    hashed_password: str = Field(nullable=False, max_length=255)
    full_name: Optional[str] = Field(default=None, max_length=255)
    status: UserStatus = Field(default=UserStatus.ACTIVE)

    # Performance Intelligence fields
    points_balance: int = Field(default=0)  # Renamed from points
    streak_count: int = Field(default=0)   # Renamed from streak
    total_tasks_completed: int = Field(default=0)
    last_completion_date: Optional[datetime] = Field(default=None)
    
    # New enterprise metrics
    completion_rate: float = Field(default=0.0)  # Percentage of tasks completed on time
    execution_velocity: float = Field(default=0.0)  # Tasks per week adjusted for complexity
    focus_consistency: float = Field(default=0.0)  # Average time between task start and completion
    collaboration_efficiency: float = Field(default=0.0)  # Response time and resolution speed

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str
    name: Optional[str] = None  # Match frontend field name


class UserRead(UserBase):
    """Schema for reading user data (without password)."""
    id: int
    full_name: Optional[str]
    points_balance: int
    streak_count: int
    total_tasks_completed: int
    last_completion_date: Optional[datetime]
    status: UserStatus
    created_at: datetime
    updated_at: datetime
    
    # Enterprise performance metrics
    completion_rate: float
    execution_velocity: float
    focus_consistency: float
    collaboration_efficiency: float


class UserUpdate(SQLModel):
    """Schema for updating user data."""
    email: Optional[str] = None