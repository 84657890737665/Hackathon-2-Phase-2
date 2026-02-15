# backend/src/models/performance_metric.py

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional, List


class PerformanceMetricBase(SQLModel):
    """Base model for performance metrics with common fields."""
    user_id: int = Field(foreign_key="users.id", index=True)
    metric_type: str = Field(max_length=50)  # 'completion_rate', 'execution_velocity', etc.
    metric_value: float
    calculated_at: datetime = Field(default_factory=datetime.now)
    period_start: datetime
    period_end: datetime


class PerformanceMetric(PerformanceMetricBase, table=True):
    """Performance metric model storing historical performance data."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    metric_type: str = Field(max_length=50)
    metric_value: float
    calculated_at: datetime = Field(default_factory=datetime.now)
    period_start: datetime
    period_end: datetime
    trend_direction: str = Field(default="neutral", max_length=10)  # 'up', 'down', 'neutral'
    benchmark_percentile: Optional[float] = Field(default=None)  # How this compares to similar users


class PerformanceMetricCreate(PerformanceMetricBase):
    """Schema for creating a new performance metric."""
    pass


class PerformanceMetricRead(PerformanceMetricBase):
    """Schema for reading performance metric data."""
    id: int


class PerformanceMetricUpdate(SQLModel):
    """Schema for updating performance metric data."""
    metric_value: Optional[float] = None
    trend_direction: Optional[str] = None
    benchmark_percentile: Optional[float] = None


class PerformanceProfileRead(SQLModel):
    """Schema for the complete performance profile of a user."""
    user_id: int
    points_balance: int
    streak_count: int
    total_tasks_completed: int
    completion_rate: float
    execution_velocity: float
    focus_consistency: float
    collaboration_efficiency: float
    calculated_at: datetime
    last_activity_date: Optional[str]
    
    # Historical trends
    completion_rate_trend: List[dict]  # [{"date": "YYYY-MM-DD", "value": 0.85}, ...]
    execution_velocity_trend: List[dict]
    streak_trend: List[dict]