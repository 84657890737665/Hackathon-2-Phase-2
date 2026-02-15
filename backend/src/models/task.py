# backend/src/models/task.py

import json
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text
from datetime import datetime
from typing import Optional, List
from enum import Enum


class TaskPriority(str, Enum):
    """Enum for task priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class TaskBase(SQLModel):
    """Base model for task with common fields."""
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Task model representing a user's task."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    due_date: Optional[datetime] = Field(default=None)
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM)
    tags_str: Optional[str] = Field(default="[]", sa_column=Column("tags", Text), description="JSON string representation of tags")  # Store as JSON string in DB
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    @property
    def tags(self) -> List[str]:
        """Get tags as a list from the JSON string."""
        if self.tags_str:
            return json.loads(self.tags_str)
        return []

    @tags.setter
    def tags(self, value: List[str]) -> None:
        """Set tags as a JSON string in the database."""
        self.tags_str = json.dumps(value)


class TaskCreate(TaskBase):
    """Schema for creating a new task."""
    due_date: Optional[datetime] = None
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    tags: Optional[List[str]] = []


class TaskRead(TaskBase):
    """Schema for reading task data."""
    id: int
    user_id: int
    due_date: Optional[datetime] = None
    priority: TaskPriority
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime
    
    @classmethod
    def from_orm(cls, obj):
        """Convert from ORM object with proper tags handling."""
        tags_list = json.loads(obj.tags_str) if obj.tags_str else []
        return cls(
            id=obj.id,
            user_id=obj.user_id,
            title=obj.title,
            description=obj.description,
            completed=obj.completed,
            due_date=obj.due_date,
            priority=obj.priority,
            tags=tags_list,
            created_at=obj.created_at,
            updated_at=obj.updated_at
        )


class TaskListRead(SQLModel):
    """Schema for a list of tasks (wrapped)."""
    tasks: List[TaskRead]


class TaskUpdate(SQLModel):
    """Schema for updating task data."""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[TaskPriority] = None
    tags: Optional[List[str]] = None


class TaskPatch(SQLModel):
    """Schema for partially updating task data (e.g., toggling completion)."""
    completed: Optional[bool] = None
    due_date: Optional[datetime] = None
    priority: Optional[TaskPriority] = None
    tags: Optional[List[str]] = None