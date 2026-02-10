# backend/src/models/task.py

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List


class TaskBase(SQLModel):
    """Base model for task with common fields."""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Task model representing a user's task."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    pass


class TaskRead(TaskBase):
    """Schema for reading task data."""
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime


class TaskListRead(SQLModel):
    """Schema for a list of tasks (wrapped)."""
    tasks: List[TaskRead]


class TaskUpdate(SQLModel):
    """Schema for updating task data."""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskPatch(SQLModel):
    """Schema for partially updating task data (e.g., toggling completion)."""
    completed: Optional[bool] = None