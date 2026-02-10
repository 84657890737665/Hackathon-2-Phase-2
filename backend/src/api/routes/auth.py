from fastapi import APIRouter, HTTPException, Depends, status
from slowapi import Limiter, shared_limiter
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from src.db.database import get_session
from src.models.user import User, UserCreate
from src.utils.jwt import get_password_hash
from src.services.user_service import UserService
from src.api.deps import get_current_user
from src.utils.logging.logger import setup_logger

# Initialize logger
logger = setup_logger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
@shared_limiter.limit("5/minute")  # Limit signup attempts
def signup(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Create a new user account.

    Args:
        user_data: User creation data including email and password
        session: Database session for operations

    Returns:
        Dictionary with success status and user information

    Raises:
        HTTPException: If email already exists or validation fails
    """
    logger.info(f"Signup attempt for email: {user_data.email}")
    
    user_service = UserService(session)

    # Validate email format (basic validation)
    if len(user_data.email) < 5 or "@" not in user_data.email or "." not in user_data.email:
        logger.warning(f"Invalid email format attempted: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Validate password strength
    if len(user_data.password) < 8:
        logger.warning(f"Weak password attempted for email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )

    # Additional password validation: check for uppercase, lowercase, and digit
    password = user_data.password
    if not (any(c.isupper() for c in password) and
            any(c.islower() for c in password) and
            any(c.isdigit() for c in password)):
        logger.warning(f"Password does not meet complexity requirements for email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain uppercase, lowercase, and numeric characters"
        )

    try:
        # Create new user using the service
        db_user = user_service.create_user(user_data)
        logger.info(f"User created successfully with ID: {db_user.id}")
    except ValueError as e:
        logger.warning(f"Signup conflict for email {user_data.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error during signup for email {user_data.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # Return success response
    return {
        "success": True,
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "created_at": db_user.created_at.isoformat()
        },
        "message": "Account created successfully"
    }


@router.post("/signin", response_model=dict)
@shared_limiter.limit("10/minute")  # Limit sign in attempts
def signin(user_data: UserCreate, session: Session = Depends(get_session)):
    """
    Authenticate user and return JWT token.

    Args:
        user_data: User credentials (email and password)
        session: Database session for operations

    Returns:
        Dictionary with success status, user information, and JWT token
    """
    logger.info(f"Signin attempt for email: {user_data.email}")
    
    from src.utils.jwt import create_access_token, create_refresh_token

    # Use the user service to authenticate
    user_service = UserService(session)
    user = user_service.authenticate_user(user_data.email, user_data.password)

    if not user:
        logger.warning(f"Failed signin attempt for email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create JWT tokens
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "user_id": user.id
    }
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    
    logger.info(f"Successful signin for user ID: {user.id}")

    return {
        "success": True,
        "user": {
            "id": user.id,
            "email": user.email
        },
        "token": access_token,
        "refresh_token": refresh_token,
        "expires_in": 3600  # 1 hour in seconds (for access token)
    }


@router.post("/signout", response_model=dict)
def signout(current_user: User = Depends(get_current_user)):
    """
    Invalidate the current session/token.

    Args:
        current_user: The currently authenticated user (from JWT token)

    Returns:
        Dictionary with success status and message
    """
    # In a stateless JWT system, we typically don't store tokens on the server
    # So "signing out" usually means the client just discards the token
    # But we can log the event or perform other cleanup tasks

    return {
        "success": True,
        "message": "Signed out successfully"
    }


@router.post("/refresh", response_model=dict)
def refresh_token(refresh_token: str):
    """
    Refresh an access token using a refresh token.

    Args:
        refresh_token: The refresh token to use for generating a new access token

    Returns:
        Dictionary with new access token
    """
    logger.info("Token refresh attempt")
    
    from src.utils.jwt import verify_refresh_token, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

    payload = verify_refresh_token(refresh_token)
    if not payload:
        logger.warning("Invalid refresh token provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    # Create new access token
    new_token_data = {
        "sub": payload.get("sub"),
        "email": payload.get("email"),
        "user_id": payload.get("user_id")
    }
    new_access_token = create_access_token(data=new_token_data)
    
    logger.info(f"Token refreshed successfully for user ID: {payload.get('user_id')}")

    return {
        "token": new_access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60  # Convert to seconds
    }