# backend/src/models/achievement.py

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List


class AchievementBase(SQLModel):
    """Base model for achievements."""
    name: str = Field(max_length=255)
    description: str = Field(max_length=500)
    icon: str = Field(max_length=50) # Emoji or icon name
    requirement_type: str = Field(max_length=50) # 'total_tasks', 'streak', etc.
    requirement_value: int
    points_reward: int = Field(default=0)


class Achievement(AchievementBase, table=True):
    """Achievement model representing a badge that can be unlocked."""
    id: Optional[int] = Field(default=None, primary_key=True)


class UserAchievement(SQLModel, table=True):
    """Link table between Users and Achievements."""
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    achievement_id: int = Field(foreign_key="achievement.id", primary_key=True)
    unlocked_at: datetime = Field(default_factory=datetime.now)


class AchievementRead(AchievementBase):
    """Schema for reading achievement data."""
    id: int


class UserStatsRead(SQLModel):
    """Schema for reading user gamification stats."""
    points: int
    streak: int
    total_tasks_completed: int
    achievements: List[AchievementRead]

class RewardProfileRead(SQLModel):
    """Schema for the User Reward Profile (Enterprise Spec)."""
    user_id: int
    points_balance: int
    lifetime_points: int
    streak_count: int
    longest_streak: int
    last_activity_date: Optional[str]
    total_tasks_completed: int
    created_at: datetime
    updated_at: datetime

class AvailableAchievementRead(AchievementRead):
    """Schema for available achievements with progress."""
    current_progress: int
    percentage_complete: float
    unlocked: bool
