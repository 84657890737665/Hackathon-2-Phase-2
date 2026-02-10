import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from datetime import datetime

from src.main import create_app
from src.db.database import get_session
from src.models.user import User, UserCreate


@pytest.fixture(name="session")
def session_fixture():
    """Create an in-memory database session for testing."""
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(bind=engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create a test client with dependency overrides."""
    def get_session_override():
        return session

    app = create_app()
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_signup_new_user(client: TestClient, session: Session):
    """Test successful user signup."""
    # Arrange
    signup_data = {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }
    
    # Act
    response = client.post("/auth/signup", json=signup_data)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["email"] == signup_data["email"]
    assert "id" in data["user"]
    
    # Verify user was created in database
    user = session.get(User, data["user"]["id"])
    assert user is not None
    assert user.email == signup_data["email"]


def test_signup_duplicate_email(client: TestClient, session: Session):
    """Test signup with duplicate email returns conflict error."""
    # Arrange - Create a user first
    signup_data = {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }
    response = client.post("/auth/signup", json=signup_data)
    assert response.status_code == 200  # First signup should succeed
    
    # Act - Try to create another user with same email
    response = client.post("/auth/signup", json=signup_data)
    
    # Assert
    assert response.status_code == 409  # Conflict


def test_signup_invalid_email_format(client: TestClient):
    """Test signup with invalid email format returns bad request."""
    # Arrange
    signup_data = {
        "email": "invalid-email",
        "password": "SecurePass123!"
    }
    
    # Act
    response = client.post("/auth/signup", json=signup_data)
    
    # Assert
    assert response.status_code == 400


def test_signup_weak_password(client: TestClient):
    """Test signup with weak password returns bad request."""
    # Arrange
    signup_data = {
        "email": "test@example.com",
        "password": "weak"  # Too short
    }
    
    # Act
    response = client.post("/auth/signup", json=signup_data)
    
    # Assert
    assert response.status_code == 400


def test_signin_valid_credentials(client: TestClient, session: Session):
    """Test successful signin with valid credentials."""
    # Arrange - Create a user first
    signup_data = {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }
    signup_response = client.post("/auth/signup", json=signup_data)
    assert signup_response.status_code == 200
    
    # Act - Sign in with the same credentials
    signin_data = {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }
    response = client.post("/auth/signin", json=signin_data)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["user"]["email"] == signin_data["email"]
    assert "token" in data
    assert data["expires_in"] == 604800  # 7 days in seconds


def test_signin_invalid_credentials(client: TestClient):
    """Test signin with invalid credentials returns unauthorized."""
    # Arrange - Try to sign in without creating a user
    signin_data = {
        "email": "nonexistent@example.com",
        "password": "AnyPassword123!"
    }
    
    # Act
    response = client.post("/auth/signin", json=signin_data)
    
    # Assert
    assert response.status_code == 401


def test_signin_wrong_password(client: TestClient, session: Session):
    """Test signin with wrong password returns unauthorized."""
    # Arrange - Create a user first
    signup_data = {
        "email": "test@example.com",
        "password": "SecurePass123!"
    }
    signup_response = client.post("/auth/signup", json=signup_data)
    assert signup_response.status_code == 200
    
    # Act - Try to sign in with wrong password
    signin_data = {
        "email": "test@example.com",
        "password": "WrongPassword456!"
    }
    response = client.post("/auth/signin", json=signin_data)
    
    # Assert
    assert response.status_code == 401


def test_signout_endpoint_exists(client: TestClient):
    """Test that signout endpoint exists and returns expected response."""
    # Note: Since we're using stateless JWTs, signout is mostly client-side
    # but we can still test that the endpoint exists and returns the expected response
    
    # Act
    response = client.post("/auth/signout")
    
    # Assert
    # This will likely return 401 because no token is provided, but that's expected
    # The important thing is that the endpoint exists
    assert response.status_code in [401, 200]  # Could be 401 if auth required or 200 if no auth required