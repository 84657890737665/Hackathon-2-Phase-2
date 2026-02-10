import pytest
from unittest.mock import Mock, MagicMock
from sqlmodel import Session, select
from datetime import datetime

from src.models.user import User
from src.services.user_service import UserService


@pytest.fixture
def mock_session():
    """Mock database session for testing."""
    session = Mock(spec=Session)
    return session


@pytest.fixture
def user_service(mock_session):
    """Create a UserService instance with a mock session."""
    return UserService(mock_session)


def test_create_user_success(user_service, mock_session):
    """Test successful user creation."""
    from src.models.user import UserCreate
    
    # Arrange
    user_create = UserCreate(email="test@example.com", password="SecurePass123!")
    
    # Mock the database query to return None (no existing user)
    mock_session.exec.return_value.first.return_value = None
    
    # Act
    result = user_service.create_user(user_create)
    
    # Assert
    assert result.email == user_create.email
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()


def test_create_user_duplicate_email(user_service, mock_session):
    """Test user creation with duplicate email raises ValueError."""
    from src.models.user import UserCreate
    
    # Arrange
    user_create = UserCreate(email="test@example.com", password="SecurePass123!")
    
    # Mock the database query to return an existing user
    existing_user = User(id=1, email="test@example.com", hashed_password="hashed")
    mock_session.exec.return_value.first.return_value = existing_user
    
    # Act & Assert
    with pytest.raises(ValueError, match=f"Email {user_create.email} is already registered"):
        user_service.create_user(user_create)


def test_get_user_by_email_found(user_service, mock_session):
    """Test getting a user by email when user exists."""
    # Arrange
    email = "test@example.com"
    expected_user = User(id=1, email=email, hashed_password="hashed")
    mock_session.exec.return_value.first.return_value = expected_user
    
    # Act
    result = user_service.get_user_by_email(email)
    
    # Assert
    assert result == expected_user


def test_get_user_by_email_not_found(user_service, mock_session):
    """Test getting a user by email when user does not exist."""
    # Arrange
    email = "nonexistent@example.com"
    mock_session.exec.return_value.first.return_value = None
    
    # Act
    result = user_service.get_user_by_email(email)
    
    # Assert
    assert result is None


def test_get_user_by_id_found(user_service, mock_session):
    """Test getting a user by ID when user exists."""
    # Arrange
    user_id = 1
    expected_user = User(id=user_id, email="test@example.com", hashed_password="hashed")
    mock_session.get.return_value = expected_user
    
    # Act
    result = user_service.get_user_by_id(user_id)
    
    # Assert
    assert result == expected_user
    mock_session.get.assert_called_once_with(User, user_id)


def test_get_user_by_id_not_found(user_service, mock_session):
    """Test getting a user by ID when user does not exist."""
    # Arrange
    user_id = 999
    mock_session.get.return_value = None
    
    # Act
    result = user_service.get_user_by_id(user_id)
    
    # Assert
    assert result is None
    mock_session.get.assert_called_once_with(User, user_id)


def test_authenticate_user_success(user_service, mock_session):
    """Test successful user authentication."""
    from src.utils.jwt import get_password_hash
    
    # Arrange
    email = "test@example.com"
    password = "SecurePass123!"
    hashed_password = get_password_hash(password)
    
    user = User(id=1, email=email, hashed_password=hashed_password)
    mock_session.exec.return_value.first.return_value = user
    
    # Act
    result = user_service.authenticate_user(email, password)
    
    # Assert
    assert result == user


def test_authenticate_user_wrong_password(user_service, mock_session):
    """Test authentication with wrong password returns None."""
    from src.utils.jwt import get_password_hash
    
    # Arrange
    email = "test@example.com"
    correct_password = "SecurePass123!"
    wrong_password = "WrongPass456!"
    hashed_correct_password = get_password_hash(correct_password)
    
    user = User(id=1, email=email, hashed_password=hashed_correct_password)
    mock_session.exec.return_value.first.return_value = user
    
    # Act
    result = user_service.authenticate_user(email, wrong_password)
    
    # Assert
    assert result is None


def test_authenticate_user_nonexistent_user(user_service, mock_session):
    """Test authentication with non-existent user returns None."""
    # Arrange
    email = "nonexistent@example.com"
    password = "AnyPassword123!"
    mock_session.exec.return_value.first.return_value = None
    
    # Act
    result = user_service.authenticate_user(email, password)
    
    # Assert
    assert result is None