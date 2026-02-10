# backend/src/services/gamification_service.py

from sqlmodel import Session, select
from datetime import datetime, timedelta
from typing import List, Optional

from src.models.user import User
from src.models.achievement import Achievement, UserAchievement
from src.models.task_completion import TaskCompletion
import json

class GamificationService:
    def __init__(self, session: Session):
        self.session = session

    def update_user_stats(self, user_id: int, task_id: int, task_title: str, completed: bool) -> dict:
        """Update user points, streak, and task counts when a task is completed."""
        user = self.session.get(User, user_id)
        if not user:
            return {"points": 0, "streak_updated": False, "achievements_unlocked": []}

        rewards_earned = {
            "points": 0,
            "streak_updated": False,
            "achievements_unlocked": []
        }

        if completed:
            # Award base points (FR-009)
            user.points += 10
            user.total_tasks_completed += 1
            rewards_earned["points"] += 10

            # Handle streak
            today = datetime.now().date()
            if user.last_completion_date:
                last_date = user.last_completion_date.date()
                if last_date == today:
                    pass
                elif last_date == today - timedelta(days=1):
                    user.streak += 1
                    rewards_earned["streak_updated"] = True
                else:
                    user.streak = 1
                    rewards_earned["streak_updated"] = True
            else:
                user.streak = 1
                rewards_earned["streak_updated"] = True

            user.last_completion_date = datetime.now()
            
            # Check for achievements
            new_achievements = self.check_achievements(user)
            if new_achievements:
                rewards_earned["achievements_unlocked"] = new_achievements
                for ach in new_achievements:
                    user.points += ach.points_reward
                    rewards_earned["points"] += ach.points_reward

            # Record Task Completion History (FR-006)
            completion = TaskCompletion(
                task_id=task_id,
                user_id=user_id,
                task_title=task_title,
                points_awarded=rewards_earned["points"],
                streak_incremented=rewards_earned["streak_updated"],
                achievement_unlocked_ids=json.dumps([a.id for a in new_achievements]),
                completed_at=user.last_completion_date
            )
            self.session.add(completion)
        
        user.updated_at = datetime.now()
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return rewards_earned

    def check_achievements(self, user: User) -> List[Achievement]:
        """Check and unlock achievements for the user."""
        # Define achievements if they don't exist in DB
        # In a real app, these would be seeded
        achievements_to_check = [
            {"id_name": "first_task", "name": "First Steps", "desc": "Complete your first task", "type": "total_tasks", "value": 1, "icon": "🏆", "points": 50},
            {"id_name": "ten_tasks", "name": "Getting Started", "desc": "Complete 10 tasks", "type": "total_tasks", "value": 10, "icon": "🚀", "points": 100},
            {"id_name": "fifty_tasks", "name": "Productivity Master", "desc": "Complete 50 tasks", "type": "total_tasks", "value": 50, "icon": "⚡", "points": 500},
            {"id_name": "hundred_tasks", "name": "Legend Status", "desc": "Complete 100 tasks", "type": "total_tasks", "value": 100, "icon": "👑", "points": 1000},
            {"id_name": "seven_day_streak", "name": "Consistency King", "desc": "Maintain a 7-day streak", "type": "streak", "value": 7, "icon": "🔥", "points": 250},
        ]

        unlocked_achievements = []

        for ach_data in achievements_to_check:
            # Find or Create achievement in DB
            achievement = self.session.exec(select(Achievement).where(Achievement.name == ach_data["name"])).first()
            if not achievement:
                achievement = Achievement(
                    name=ach_data["name"],
                    description=ach_data["desc"],
                    icon=ach_data["icon"],
                    requirement_type=ach_data["type"],
                    requirement_value=ach_data["value"],
                    points_reward=ach_data["points"]
                )
                self.session.add(achievement)
                self.session.commit()
                self.session.refresh(achievement)

            # Check if user already has it
            existing = self.session.exec(select(UserAchievement).where(
                UserAchievement.user_id == user.id,
                UserAchievement.achievement_id == achievement.id
            )).first()

            if not existing:
                should_unlock = False
                if ach_data["type"] == "total_tasks" and user.total_tasks_completed >= ach_data["value"]:
                    should_unlock = True
                elif ach_data["type"] == "streak" and user.streak >= ach_data["value"]:
                    should_unlock = True

                if should_unlock:
                    user_ach = UserAchievement(user_id=user.id, achievement_id=achievement.id)
                    self.session.add(user_ach)
                    unlocked_achievements.append(achievement)
        
        if unlocked_achievements:
            self.session.commit()
            
        return unlocked_achievements

    def get_user_achievements(self, user_id: int) -> List[Achievement]:
        """Get all achievements unlocked by a user."""
        statement = select(Achievement).join(UserAchievement).where(UserAchievement.user_id == user_id)
        return self.session.exec(statement).all()
