import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from jose import jwt
import os

from src.main import create_app
from src.db.database import get_session
from src.models.user import User
from src.models.task import Task
from src.utils.jwt import create_access_token


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


@pytest.fixture(name="authenticated_client")
def authenticated_client_fixture(client: TestClient, session: Session):
    """Create a client with an authenticated user."""
    # Create a user
    user = User(
        email="test@example.com",
        hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "testpassword"
        created_at=session.get_bind().execute("SELECT datetime('now')").fetchone()[0],
        updated_at=session.get_bind().execute("SELECT datetime('now')").fetchone()[0]
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Create a JWT token for the user
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "user_id": user.id
    }
    token = create_access_token(data=token_data)
    
    # Add the token to the client's default headers
    client.headers.update({"Authorization": f"Bearer {token}"})
    
    yield client, user


def test_get_tasks_empty_list(authenticated_client):
    """Test getting tasks when user has no tasks."""
    client, user = authenticated_client
    
    # Act
    response = client.get(f"/api/{user.id}/tasks")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data == []


def test_create_task_success(authenticated_client, session: Session):
    """Test successfully creating a task."""
    client, user = authenticated_client
    
    # Arrange
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }
    
    # Act
    response = client.post(f"/api/{user.id}/tasks", json=task_data)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["completed"] == task_data["completed"]
    assert data["user_id"] == user.id
    
    # Verify task was saved in database
    task = session.get(Task, data["id"])
    assert task is not None
    assert task.title == task_data["title"]


def test_get_specific_task_success(authenticated_client, session: Session):
    """Test getting a specific task."""
    client, user = authenticated_client
    
    # Arrange - Create a task first
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user.id}/tasks", json=task_data)
    assert create_response.status_code == 200
    task_id = create_response.json()["id"]
    
    # Act
    response = client.get(f"/api/{user.id}/tasks/{task_id}")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == task_data["title"]


def test_update_task_success(authenticated_client):
    """Test successfully updating a task."""
    client, user = authenticated_client
    
    # Arrange - Create a task first
    task_data = {
        "title": "Original Task",
        "description": "Original Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user.id}/tasks", json=task_data)
    assert create_response.status_code == 200
    task_id = create_response.json()["id"]
    
    # Act - Update the task
    update_data = {
        "title": "Updated Task",
        "description": "Updated Description",
        "completed": True
    }
    response = client.put(f"/api/{user.id}/tasks/{task_id}", json=update_data)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["description"] == update_data["description"]
    assert data["completed"] == update_data["completed"]


def test_delete_task_success(authenticated_client, session: Session):
    """Test successfully deleting a task."""
    client, user = authenticated_client
    
    # Arrange - Create a task first
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user.id}/tasks", json=task_data)
    assert create_response.status_code == 200
    task_id = create_response.json()["id"]
    
    # Verify task exists
    assert session.get(Task, task_id) is not None
    
    # Act
    response = client.delete(f"/api/{user.id}/tasks/{task_id}")
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    
    # Verify task was deleted from database
    assert session.get(Task, task_id) is None


def test_toggle_task_completion_success(authenticated_client):
    """Test successfully toggling task completion status."""
    client, user = authenticated_client
    
    # Arrange - Create a task first
    task_data = {
        "title": "Test Task",
        "description": "Test Description",
        "completed": False
    }
    create_response = client.post(f"/api/{user.id}/tasks", json=task_data)
    assert create_response.status_code == 200
    task_id = create_response.json()["id"]
    
    # Verify initial state
    get_response = client.get(f"/api/{user.id}/tasks/{task_id}")
    assert get_response.status_code == 200
    assert get_response.json()["completed"] is False
    
    # Act - Toggle completion
    patch_data = {"completed": True}
    response = client.patch(f"/api/{user.id}/tasks/{task_id}/complete", json=patch_data)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["completed"] is True


def test_user_isolation(authenticated_client, session: Session):
    """Test that users can only access their own tasks."""
    client, user = authenticated_client
    
    # Arrange - Create another user and task
    other_user = User(
        email="other@example.com",
        hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "testpassword"
        created_at=session.get_bind().execute("SELECT datetime('now')").fetchone()[0],
        updated_at=session.get_bind().execute("SELECT datetime('now')").fetchone()[0]
    )
    session.add(other_user)
    session.commit()
    session.refresh(other_user)
    
    # Create a task for the other user
    other_task_data = {
        "title": "Other User's Task",
        "description": "Private Task",
        "completed": False
    }
    
    # Temporarily switch to other user's token
    other_token_data = {
        "sub": str(other_user.id),
        "email": other_user.email,
        "user_id": other_user.id
    }
    other_token = create_access_token(data=other_token_data)
    client.headers.update({"Authorization": f"Bearer {other_token}"})
    
    create_response = client.post(f"/api/{other_user.id}/tasks", json=other_task_data)
    assert create_response.status_code == 200
    other_task_id = create_response.json()["id"]
    
    # Switch back to original user's token
    original_token_data = {
        "sub": str(user.id),
        "email": user.email,
        "user_id": user.id
    }
    original_token = create_access_token(data=original_token_data)
    client.headers.update({"Authorization": f"Bearer {original_token}"})
    
    # Act - Try to access other user's task using original user's ID in URL
    # This should fail due to user ID validation
    response = client.get(f"/api/{other_user.id}/tasks/{other_task_id}")
    
    # Assert - Should get forbidden error due to user ID mismatch
    assert response.status_code == 403