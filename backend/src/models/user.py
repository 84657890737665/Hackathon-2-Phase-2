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
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, nullable=False, max_length=255)
    hashed_password: str = Field(nullable=False, max_length=255)
    status: UserStatus = Field(default=UserStatus.ACTIVE)
    
    # Gamification fields
    points: int = Field(default=0)
    streak: int = Field(default=0)
    total_tasks_completed: int = Field(default=0)
    last_completion_date: Optional[datetime] = Field(default=None)
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str


class UserRead(UserBase):
    """Schema for reading user data (without password)."""
    id: int
    points: int
    streak: int
    total_tasks_completed: int
    last_completion_date: Optional[datetime]
    status: UserStatus
    created_at: datetime
    updated_at: datetime


class UserUpdate(SQLModel):
    """Schema for updating user data."""
    email: Optional[str] = None