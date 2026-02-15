# backend/src/models/task_completion.py

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List
import json

class TaskCompletion(SQLModel, table=True):
    """Tracks task completion events for reward calculation and history log."""
    id: Optional[int] = Field(default=None, primary_key=True)
    task_id: int = Field(foreign_key="task.id")
    user_id: int = Field(foreign_key="users.id", index=True)
    task_title: str = Field(max_length=255) # Denormalized for history speed
    points_awarded: int = Field(default=0)
    streak_incremented: bool = Field(default=False)
    achievement_unlocked_ids: str = Field(default="[]") # JSON string of IDs
    completed_at: datetime = Field(default_factory=datetime.now, index=True)
    created_at: datetime = Field(default_factory=datetime.now)

class TaskCompletionRead(SQLModel):
    """Schema for reading task completion history."""
    id: int
    task_id: int
    task_title: str
    points_awarded: int
    streak_incremented: bool
    achievement_unlocked_ids: List[int]
    completed_at: datetime
    created_at: datetime

class TaskCompletionHistory(SQLModel):
    """Schema for wrapped completion history with pagination."""
    user_id: int
    completions: List[TaskCompletionRead]
    total: int
