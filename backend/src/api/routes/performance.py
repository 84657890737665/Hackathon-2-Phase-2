# backend/src/api/routes/performance.py

from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime, timedelta

from src.db.database import get_session
from src.models.user import User
from src.models.performance_metric import PerformanceProfileRead
from src.services.performance_service import PerformanceService
from src.api.deps import get_current_user
from src.utils.logging.logger import setup_logger

# Initialize logger
logger = setup_logger(__name__)

router = APIRouter(prefix="/api/{user_id}/performance", tags=["performance"])


@router.get("/profile", response_model=PerformanceProfileRead)
def get_performance_profile(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve the user's performance profile with all metrics and trends.
    
    Args:
        user_id: The ID of the user whose performance profile to retrieve
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations
        
    Returns:
        PerformanceProfileRead containing all calculated metrics
    """
    logger.info(f"Retrieving performance profile for user ID: {user_id}")
    
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        logger.warning(f"User {current_user.id} attempted to access performance profile for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's performance profile"
        )
    
    # Calculate performance metrics
    performance_service = PerformanceService(session)
    profile = performance_service.calculate_performance_profile(user_id)
    
    logger.info(f"Performance profile retrieved successfully for user ID: {user_id}")
    
    return profile


@router.get("/analytics", response_model=dict)
def get_performance_analytics(
    user_id: int,
    period: str = "month",  # "week", "month", "quarter", "year"
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve detailed performance analytics for the specified period.
    
    Args:
        user_id: The ID of the user whose analytics to retrieve
        period: The time period for analytics ("week", "month", "quarter", "year")
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations
        
    Returns:
        Dictionary containing detailed performance analytics
    """
    logger.info(f"Retrieving performance analytics for user ID: {user_id}, period: {period}")
    
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        logger.warning(f"User {current_user.id} attempted to access analytics for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's analytics"
        )
    
    # Calculate period bounds
    now = datetime.now()
    if period == "week":
        start_date = now - timedelta(weeks=1)
    elif period == "month":
        start_date = now - timedelta(days=30)
    elif period == "quarter":
        start_date = now - timedelta(days=90)
    elif period == "year":
        start_date = now - timedelta(days=365)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid period. Use 'week', 'month', 'quarter', or 'year'"
        )
    
    # Get user's tasks for the period
    from src.models.task import Task
    user_tasks = session.exec(
        select(Task)
        .where(Task.user_id == user_id)
        .where(Task.created_at >= start_date)
    ).all()
    
    # Calculate analytics
    completed_tasks = [task for task in user_tasks if task.completed]
    total_tasks = len(user_tasks)
    completed_count = len(completed_tasks)
    
    completion_rate = (completed_count / total_tasks) if total_tasks > 0 else 0
    
    # Calculate productivity insights
    productivity_insights = []
    if completed_tasks:
        # Most productive days
        day_counts = {}
        for task in completed_tasks:
            day_of_week = task.updated_at.weekday()  # 0=Monday, 6=Sunday
            day_counts[day_of_week] = day_counts.get(day_of_week, 0) + 1
        
        most_productive_day = max(day_counts, key=day_counts.get) if day_counts else None
        if most_productive_day is not None:
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            productivity_insights.append({
                "type": "most_productive_day",
                "message": f"You're most productive on {days[most_productive_day]}s",
                "value": day_counts[most_productive_day]
            })
    
    analytics = {
        "period": period,
        "summary": {
            "total_tasks": total_tasks,
            "completed_tasks": completed_count,
            "completion_rate": completion_rate,
            "tasks_per_day_avg": total_tasks / (30 if period == "month" else 7 if period == "week" else 90 if period == "quarter" else 365)
        },
        "trends": {
            "completion_rate_trend": "increasing",  # Placeholder - would calculate actual trend
            "productivity_trend": "stable",        # Placeholder - would calculate actual trend
        },
        "insights": productivity_insights,
        "calculated_at": now.isoformat()
    }
    
    logger.info(f"Performance analytics retrieved successfully for user ID: {user_id}")
    
    return analytics


@router.get("/recommendations", response_model=dict)
def get_performance_recommendations(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get AI-powered performance recommendations based on user's task patterns.
    
    Args:
        user_id: The ID of the user whose recommendations to retrieve
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations
        
    Returns:
        Dictionary containing performance recommendations
    """
    logger.info(f"Generating performance recommendations for user ID: {user_id}")
    
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        logger.warning(f"User {current_user.id} attempted to access recommendations for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's recommendations"
        )
    
    # Get user's tasks
    from src.models.task import Task
    all_tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
    
    recommendations = []
    
    # Analyze task patterns
    completed_tasks = [task for task in all_tasks if task.completed]
    incomplete_tasks = [task for task in all_tasks if not task.completed]
    
    # Recommendation 1: Task completion patterns
    if completed_tasks:
        avg_completion_time = sum(
            (task.updated_at - task.created_at).total_seconds() 
            for task in completed_tasks
        ) / len(completed_tasks) / 3600  # Convert to hours
        
        if avg_completion_time > 24:  # More than a day
            recommendations.append({
                "id": "break_down_large_tasks",
                "title": "Break Down Large Tasks",
                "description": "Your tasks take an average of {:.1f} hours to complete. Consider breaking large tasks into smaller, more manageable chunks.".format(avg_completion_time),
                "priority": "high"
            })
    
    # Recommendation 2: Deadline adherence
    overdue_tasks = [task for task in all_tasks if task.due_date and task.due_date < datetime.now() and not task.completed]
    if len(overdue_tasks) > len(all_tasks) * 0.2:  # More than 20% overdue
        recommendations.append({
            "id": "improve_deadline_management",
            "title": "Improve Deadline Management",
            "description": "You have {} overdue tasks. Consider setting more realistic deadlines or adjusting your priorities.".format(len(overdue_tasks)),
            "priority": "high"
        })
    
    # Recommendation 3: Productivity patterns
    if completed_tasks:
        # Group tasks by day of week
        day_tasks = {}
        for task in completed_tasks:
            day = task.updated_at.weekday()
            if day not in day_tasks:
                day_tasks[day] = []
            day_tasks[day].append(task)
        
        # Find least productive day
        if day_tasks:
            avg_tasks_per_day = {day: len(tasks) for day, tasks in day_tasks.items()}
            if avg_tasks_per_day:
                least_productive_day = min(avg_tasks_per_day, key=avg_tasks_per_day.get)
                days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                
                recommendations.append({
                    "id": "optimize_schedule",
                    "title": "Optimize Your Schedule",
                    "description": "You complete fewer tasks on {}s. Consider scheduling your most important tasks for other days of the week.".format(days[least_productive_day]),
                    "priority": "medium"
                })
    
    # Recommendation 4: Focus improvement
    if all_tasks:
        long_running_tasks = [
            task for task in all_tasks 
            if task.completed and (task.updated_at - task.created_at).days > 7
        ]
        if long_running_tasks:
            recommendations.append({
                "id": "improve_focus",
                "title": "Improve Focus on Long-Term Tasks",
                "description": "You have {} tasks that took more than a week to complete. Consider setting intermediate milestones for better progress tracking.".format(len(long_running_tasks)),
                "priority": "medium"
            })
    
    result = {
        "user_id": user_id,
        "recommendations": recommendations,
        "generated_at": datetime.now().isoformat(),
        "total_recommendations": len(recommendations)
    }
    
    logger.info(f"Generated {len(recommendations)} recommendations for user ID: {user_id}")
    
    return result