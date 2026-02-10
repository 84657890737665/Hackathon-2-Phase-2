from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from src.models.user import User, UserCreate
from src.utils.jwt import get_password_hash, verify_password


class UserService:
    """
    Service class for user-related operations.
    
    This class encapsulates all business logic related to user management,
    including creation, retrieval, updates, and authentication.
    """
    
    def __init__(self, session: Session):
        """
        Initialize the UserService with a database session.
        
        Args:
            session: The database session to use for operations
        """
        self.session = session
    
    def create_user(self, user_create: UserCreate) -> User:
        """
        Create a new user.
        
        Args:
            user_create: User creation data
            
        Returns:
            The created User object
            
        Raises:
            ValueError: If email is already taken
        """
        # Check if user with this email already exists
        existing_user = self.session.exec(
            select(User).where(User.email == user_create.email)
        ).first()
        
        if existing_user:
            raise ValueError(f"Email {user_create.email} is already registered")
        
        # Hash the password
        hashed_password = get_password_hash(user_create.password)
        
        # Create new user
        db_user = User(
            email=user_create.email,
            hashed_password=hashed_password,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # Add to database
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        
        return db_user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve a user by their email.
        
        Args:
            email: The email to search for
            
        Returns:
            The User object if found, None otherwise
        """
        user = self.session.exec(select(User).where(User.email == email)).first()
        return user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Retrieve a user by their ID.
        
        Args:
            user_id: The ID to search for
            
        Returns:
            The User object if found, None otherwise
        """
        user = self.session.get(User, user_id)
        return user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password.
        
        Args:
            email: The user's email
            password: The user's password
            
        Returns:
            The User object if authentication is successful, None otherwise
        """
        user = self.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user
    
    def update_user(self, user_id: int, user_update: dict) -> Optional[User]:
        """
        Update a user's information.
        
        Args:
            user_id: The ID of the user to update
            user_update: The update data
            
        Returns:
            The updated User object if successful, None otherwise
        """
        user = self.session.get(User, user_id)
        if not user:
            return None
        
        # Update fields if provided
        if "email" in user_update and user_update["email"] is not None:
            # Check if new email is already taken by another user
            existing_user = self.session.exec(
                select(User).where(User.email == user_update["email"])
            ).first()
            
            if existing_user and existing_user.id != user_id:
                raise ValueError(f"Email {user_update['email']} is already registered")
                
            user.email = user_update["email"]
        
        user.updated_at = datetime.now()
        
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        
        return user
    
    def delete_user(self, user_id: int) -> bool:
        """
        Delete a user.
        
        Args:
            user_id: The ID of the user to delete
            
        Returns:
            True if deletion was successful, False otherwise
        """
        user = self.session.get(User, user_id)
        if not user:
            return False
        
        self.session.delete(user)
        self.session.commit()
        return True