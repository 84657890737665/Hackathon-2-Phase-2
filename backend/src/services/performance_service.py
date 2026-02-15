# backend/src/services/performance_service.py

from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import List, Dict, Any
import statistics
from decimal import Decimal

from src.models.task import Task
from src.models.performance_metric import PerformanceMetric, PerformanceMetricCreate, PerformanceProfileRead
from src.models.user import User
from src.utils.logging.logger import setup_logger

# Initialize logger
logger = setup_logger(__name__)


class PerformanceService:
    """
    Service class for calculating and managing performance metrics.
    
    This service calculates meaningful productivity metrics instead of simple gamification points.
    """
    
    def __init__(self, session: Session):
        """
        Initialize the PerformanceService with a database session.
        
        Args:
            session: The database session to use for operations
        """
        self.session = session

    def calculate_performance_profile(self, user_id: int) -> PerformanceProfileRead:
        """
        Calculate the complete performance profile for a user.
        
        Args:
            user_id: The ID of the user to calculate metrics for
            
        Returns:
            PerformanceProfileRead containing all calculated metrics
        """
        # Get user
        user = self.session.get(User, user_id)
        if not user:
            raise ValueError(f"User with ID {user_id} not found")
        
        # Get user's tasks
        tasks = self.session.exec(
            select(Task).where(Task.user_id == user_id)
        ).all()
        
        # Calculate metrics
        completion_rate = self._calculate_completion_rate(tasks)
        execution_velocity = self._calculate_execution_velocity(tasks, user_id)
        focus_consistency = self._calculate_focus_consistency(tasks)
        collaboration_efficiency = self._calculate_collaboration_efficiency(tasks)
        
        # Calculate historical trends
        completion_rate_trend = self._calculate_completion_rate_trend(user_id)
        execution_velocity_trend = self._calculate_execution_velocity_trend(user_id)
        streak_trend = self._calculate_streak_trend(user_id)
        
        return PerformanceProfileRead(
            user_id=user_id,
            points_balance=user.points_balance,
            streak_count=user.streak_count,
            total_tasks_completed=user.total_tasks_completed,
            completion_rate=completion_rate,
            execution_velocity=execution_velocity,
            focus_consistency=focus_consistency,
            collaboration_efficiency=collaboration_efficiency,
            calculated_at=datetime.now(),
            last_activity_date=user.last_completion_date.isoformat() if user.last_completion_date else None,
            completion_rate_trend=completion_rate_trend,
            execution_velocity_trend=execution_velocity_trend,
            streak_trend=streak_trend
        )

    def _calculate_completion_rate(self, tasks: List[Task]) -> float:
        """
        Calculate the percentage of tasks completed on time.
        
        Args:
            tasks: List of tasks to calculate completion rate for
            
        Returns:
            Completion rate as a percentage (0.0 to 1.0)
        """
        if not tasks:
            return 0.0
        
        completed_tasks = [task for task in tasks if task.completed]
        total_tasks = len(tasks)
        
        if total_tasks == 0:
            return 0.0
        
        # For now, we'll calculate based on completion status only
        # In a real implementation, we'd check if tasks were completed on time
        return len(completed_tasks) / total_tasks

    def _calculate_execution_velocity(self, tasks: List[Task], user_id: int) -> float:
        """
        Calculate execution velocity (tasks completed per week adjusted for complexity).
        
        Args:
            tasks: List of tasks to calculate velocity for
            user_id: User ID for filtering tasks
            
        Returns:
            Execution velocity as tasks per week
        """
        # Get tasks from the last 4 weeks
        four_weeks_ago = datetime.now() - timedelta(weeks=4)
        recent_tasks = [
            task for task in tasks 
            if task.completed and task.updated_at >= four_weeks_ago
        ]
        
        if not recent_tasks:
            return 0.0
        
        # Calculate weeks since earliest task
        if len(recent_tasks) == 1:
            # If only one task, assume it was completed in the last week
            return 1.0
        
        # Find the earliest completed task date
        earliest_date = min(task.updated_at for task in recent_tasks)
        weeks_elapsed = max(1, (datetime.now() - earliest_date).days / 7)
        
        return len(recent_tasks) / weeks_elapsed

    def _calculate_focus_consistency(self, tasks: List[Task]) -> float:
        """
        Calculate focus consistency (average time between task start and completion).
        
        Args:
            tasks: List of tasks to calculate focus consistency for
            
        Returns:
            Focus consistency as average days between creation and completion
        """
        completed_tasks = [task for task in tasks if task.completed and task.updated_at]
        
        if not completed_tasks:
            return 0.0
        
        completion_times = []
        for task in completed_tasks:
            time_to_complete = (task.updated_at - task.created_at).total_seconds() / 86400  # Convert to days
            completion_times.append(time_to_complete)
        
        if not completion_times:
            return 0.0
        
        return sum(completion_times) / len(completion_times)  # Use sum/len instead of statistics.mean

    def _calculate_collaboration_efficiency(self, tasks: List[Task]) -> float:
        """
        Calculate collaboration efficiency (response time and resolution speed).
        
        Args:
            tasks: List of tasks to calculate collaboration efficiency for
            
        Returns:
            Collaboration efficiency score (placeholder implementation)
        """
        # Placeholder implementation - in a real system, this would track
        # team collaboration metrics like response times, resolution speeds, etc.
        return 0.0

    def _calculate_completion_rate_trend(self, user_id: int) -> List[Dict[str, Any]]:
        """
        Calculate the completion rate trend over time.
        
        Args:
            user_id: User ID to calculate trend for
            
        Returns:
            List of date-value pairs showing completion rate trend
        """
        # Get tasks from the last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        # For each day, calculate completion rate
        trend_data = []
        for i in range(30):
            day = thirty_days_ago + timedelta(days=i)
            day_start = datetime(day.year, day.month, day.day)
            day_end = day_start + timedelta(days=1)
            
            # Get tasks created on this day
            day_tasks_query = select(Task).where(
                Task.user_id == user_id,
                Task.created_at >= day_start,
                Task.created_at < day_end
            )
            day_tasks = self.session.exec(day_tasks_query).all()
            
            if day_tasks:
                completion_rate = self._calculate_completion_rate(day_tasks)
                trend_data.append({
                    "date": day_start.strftime("%Y-%m-%d"),
                    "value": float(completion_rate)
                })
        
        return trend_data

    def _calculate_execution_velocity_trend(self, user_id: int) -> List[Dict[str, Any]]:
        """
        Calculate the execution velocity trend over time.
        
        Args:
            user_id: User ID to calculate trend for
            
        Returns:
            List of date-value pairs showing execution velocity trend
        """
        # Get tasks from the last 4 weeks
        four_weeks_ago = datetime.now() - timedelta(weeks=4)
        
        # For each week, calculate execution velocity
        trend_data = []
        for i in range(4):
            week_start = four_weeks_ago + timedelta(weeks=i)
            week_end = week_start + timedelta(weeks=1)
            
            # Get tasks completed in this week
            week_tasks_query = select(Task).where(
                Task.user_id == user_id,
                Task.completed == True,
                Task.updated_at >= week_start,
                Task.updated_at < week_end
            )
            week_tasks = self.session.exec(week_tasks_query).all()
            
            if week_tasks:
                velocity = self._calculate_execution_velocity(week_tasks, user_id)
                trend_data.append({
                    "date": week_start.strftime("%Y-%m-%d"),
                    "value": float(velocity)
                })
        
        return trend_data

    def _calculate_streak_trend(self, user_id: int) -> List[Dict[str, Any]]:
        """
        Calculate the streak trend over time.
        
        Args:
            user_id: User ID to calculate trend for
            
        Returns:
            List of date-value pairs showing streak trend
        """
        # Get user's streak history (placeholder implementation)
        # In a real system, this would track streak values over time
        return [
            {"date": (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d"), "value": max(0, 5-i)}
            for i in range(7)
        ]

    def update_user_performance_metrics(self, user_id: int) -> PerformanceProfileRead:
        """
        Update user's performance metrics in the database.
        
        Args:
            user_id: The ID of the user to update metrics for
            
        Returns:
            Updated PerformanceProfileRead
        """
        profile = self.calculate_performance_profile(user_id)
        
        # Update user record with new metrics
        user = self.session.get(User, user_id)
        if user:
            user.completion_rate = profile.completion_rate
            user.execution_velocity = profile.execution_velocity
            user.focus_consistency = profile.focus_consistency
            user.collaboration_efficiency = profile.collaboration_efficiency
            
            self.session.add(user)
            self.session.commit()
        
        return profile