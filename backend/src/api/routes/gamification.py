# backend/src/api/routes/gamification.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
import json

from src.db.database import get_session
from src.models.user import User
from src.models.achievement import Achievement, UserAchievement, RewardProfileRead, AchievementRead, AvailableAchievementRead
from src.models.task_completion import TaskCompletion, TaskCompletionRead, TaskCompletionHistory
from src.services.gamification_service import GamificationService
from src.api.deps import get_current_user
from src.utils.logging.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(prefix="/api/{user_id}/gamification", tags=["gamification"])

@router.get("/profile", response_model=RewardProfileRead)
def get_reward_profile(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get user's reward profile (Points, Streaks, Stats)."""
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return RewardProfileRead(
        user_id=user_id,
        points_balance=current_user.points_balance,
        lifetime_points=current_user.points_balance, # In this impl, currently same
        streak_count=current_user.streak_count,
        longest_streak=current_user.streak_count, # Simplification
        last_activity_date=current_user.last_completion_date.date().isoformat() if current_user.last_completion_date else None,
        total_tasks_completed=current_user.total_tasks_completed,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )

@router.get("/achievements", response_model=List[AchievementRead])
def get_user_achivements(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get user's unlocked achievements."""
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    gamification_service = GamificationService(session)
    return gamification_service.get_user_achievements(user_id)

@router.get("/achievements/available", response_model=List[AvailableAchievementRead])
def get_available_achievements(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get list of achievements and user's progress towards them."""
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    # Define achievements to check progress
    achievements_to_check = [
        {"name": "First Steps", "type": "total_tasks", "value": 1},
        {"name": "Getting Started", "type": "total_tasks", "value": 10},
        {"name": "Productivity Master", "type": "total_tasks", "value": 50},
        {"name": "Legend Status", "type": "total_tasks", "value": 100},
        {"name": "Consistency King", "type": "streak", "value": 7},
    ]

    all_achievements = session.exec(select(Achievement)).all()
    unlocked_ids = {a.id for a in GamificationService(session).get_user_achievements(user_id)}
    
    available = []
    for ach in all_achievements:
        # Calculate progress
        progress = 0
        if ach.requirement_type == "total_tasks":
            progress = current_user.total_tasks_completed
        elif ach.requirement_type == "streak":
            progress = current_user.streak_count
            
        percentage = min(100, (progress / ach.requirement_value) * 100) if ach.requirement_value > 0 else 0
        
        available.append(AvailableAchievementRead(
            **ach.model_dump(),
            current_progress=progress,
            percentage_complete=round(percentage, 2),
            unlocked=(ach.id in unlocked_ids)
        ))
    
    return available

@router.get("/history", response_model=TaskCompletionHistory)
def get_completion_history(
    user_id: int,
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get chronological log of task completions and rewards."""
    if current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    statement = select(TaskCompletion).where(TaskCompletion.user_id == user_id).order_by(TaskCompletion.completed_at.desc()).offset(offset).limit(limit)
    completions = session.exec(statement).all()
    total = session.exec(select(TaskCompletion).where(TaskCompletion.user_id == user_id)).all() # total count for pagination

    return TaskCompletionHistory(
        user_id=user_id,
        completions=[
            TaskCompletionRead(
                **c.model_dump(),
                achievement_unlocked_ids=json.loads(c.achievement_unlocked_ids)
            ) for c in completions
        ],
        total=len(total)
    )
