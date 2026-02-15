from fastapi import APIRouter, HTTPException, Depends, status
from src.utils.limiter import limiter
from sqlmodel import Session, select
from typing import List
from datetime import datetime
import json

from src.db.database import get_session
from src.models.task import Task, TaskCreate, TaskRead, TaskUpdate, TaskPatch, TaskListRead
from src.models.user import User
from src.services.user_service import UserService
from src.services.gamification_service import GamificationService
from src.api.deps import get_current_user
from src.utils.logging.logger import setup_logger

# Initialize logger
logger = setup_logger(__name__)

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["tasks"])


@router.get("/", response_model=TaskListRead)
def get_tasks(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve all tasks for the specified user.

    Args:
        user_id: The ID of the user whose tasks to retrieve
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations

    Returns:
        List of tasks belonging to the specified user

    Raises:
        HTTPException: If user_id in token doesn't match URL user_id
    """
    logger.info(f"Retrieving tasks for user ID: {user_id}")
    
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        logger.warning(f"User {current_user.id} attempted to access tasks for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's tasks"
        )

    # Query tasks for the authenticated user
    db_tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
    ).all()

    # Convert to response format using from_orm method
    tasks = [TaskRead.from_orm(db_task) for db_task in db_tasks]

    logger.info(f"Retrieved {len(tasks)} tasks for user ID: {user_id}")

    return {"tasks": tasks}


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: int,
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the specified user.

    Args:
        user_id: The ID of the user creating the task
        task_data: Task creation data
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations

    Returns:
        The created task

    Raises:
        HTTPException: If user_id in token doesn't match URL user_id
    """
    logger.info(f"Creating task for user ID: {user_id}")
    
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        logger.warning(f"User {current_user.id} attempted to create task for user {user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot create task for another user"
        )

    # Create the task
    db_task = Task(
        **task_data.dict(exclude_unset=True),
        user_id=user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    logger.info(f"Task created successfully with ID: {db_task.id}")

    return TaskRead.from_orm(db_task)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve details of a specific task.
    
    Args:
        user_id: The ID of the user whose task to retrieve
        task_id: The ID of the task to retrieve
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations
        
    Returns:
        The requested task
        
    Raises:
        HTTPException: If task doesn't exist or user_id doesn't match
    """
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's task"
        )
    
    # Query the specific task for the specified user
    task = session.get(Task, task_id)
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task does not belong to user"
        )
    
    return TaskRead.from_orm(task)


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    user_id: int,
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task.
    
    Args:
        user_id: The ID of the user whose task to update
        task_id: The ID of the task to update
        task_data: Task update data
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations
        
    Returns:
        The updated task
        
    Raises:
        HTTPException: If task doesn't exist or user_id doesn't match
    """
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot update another user's task"
        )
    
    # Get the existing task
    db_task = session.get(Task, task_id)
    
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task does not belong to user"
        )
    
    # Update the task with the provided data
    update_data = task_data.dict(exclude_unset=True)

    for field, value in update_data.items():
        if field == 'tags' and value is not None:
            # Handle tags specially since it's stored as JSON
            setattr(db_task, 'tags_str', json.dumps(value))
        else:
            setattr(db_task, field, value)

    db_task.updated_at = datetime.now()

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return TaskRead.from_orm(db_task)


@router.delete("/{task_id}", response_model=dict)
def delete_task(
    user_id: int,
    task_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task.
    
    Args:
        user_id: The ID of the user whose task to delete
        task_id: The ID of the task to delete
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations
        
    Returns:
        Success message
        
    Raises:
        HTTPException: If task doesn't exist or user_id doesn't match
    """
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot delete another user's task"
        )
    
    # Get the existing task
    db_task = session.get(Task, task_id)
    
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task does not belong to user"
        )
    
    # Delete the task
    session.delete(db_task)
    session.commit()
    
    return {
        "success": True,
        "message": "Task deleted successfully"
    }


@router.patch("/{task_id}/complete/", response_model=TaskRead)
def toggle_task_completion(
    user_id: int,
    task_id: int,
    task_patch: TaskPatch,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific task.
    
    Args:
        user_id: The ID of the user whose task to update
        task_id: The ID of the task to update
        task_patch: Task completion data
        current_user: The currently authenticated user (from JWT token)
        session: Database session for operations
        
    Returns:
        The updated task
        
    Raises:
        HTTPException: If task doesn't exist or user_id doesn't match
    """
    # Verify that the authenticated user matches the requested user_id
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot update another user's task"
        )
    
    # Get the existing task
    db_task = session.get(Task, task_id)
    
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Task does not belong to user"
        )
    
    # Update the task with the provided data
    rewards_earned = None
    update_data = task_patch.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if field == 'tags' and value is not None:
            # Handle tags specially since it's stored as JSON
            setattr(db_task, 'tags_str', json.dumps(value))
        else:
            setattr(db_task, field, value)

    # If completion status is being updated
    if task_patch.completed is not None:
        was_completed = db_task.completed
        db_task.completed = task_patch.completed

        # If task was just marked as completed, update user stats
        if not was_completed and db_task.completed:
            gamification_service = GamificationService(session)
            rewards_earned = gamification_service.update_user_stats(user_id, task_id, db_task.title, completed=True)

    db_task.updated_at = datetime.now()

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    # Return task with rewards data if any (Enterprise Alignment)
    result = TaskRead.from_orm(db_task).model_dump()
    if rewards_earned:
        result["rewards_earned"] = rewards_earned

    return result