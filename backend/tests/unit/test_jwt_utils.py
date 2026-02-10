import pytest
import os
from datetime import timedelta, datetime
from jose import jwt

from src.utils.jwt import verify_password, get_password_hash, create_access_token, verify_token, decode_token_payload


def test_verify_password_success():
    """Test that verify_password returns True for correct password."""
    # Arrange
    plain_password = "SecurePassword123!"
    hashed = get_password_hash(plain_password)
    
    # Act
    result = verify_password(plain_password, hashed)
    
    # Assert
    assert result is True


def test_verify_password_failure():
    """Test that verify_password returns False for incorrect password."""
    # Arrange
    plain_password = "SecurePassword123!"
    wrong_password = "WrongPassword456!"
    hashed = get_password_hash(plain_password)
    
    # Act
    result = verify_password(wrong_password, hashed)
    
    # Assert
    assert result is False


def test_get_password_hash():
    """Test that password hashing produces different hashes for same input."""
    # Arrange
    password = "SecurePassword123!"
    
    # Act
    hash1 = get_password_hash(password)
    hash2 = get_password_hash(password)
    
    # Assert
    assert hash1 != hash2  # bcrypt includes random salt, so hashes should differ
    assert isinstance(hash1, str)
    assert isinstance(hash2, str)


def test_create_access_token():
    """Test that access token is created with correct data."""
    # Arrange
    data = {"sub": "123", "email": "test@example.com"}
    
    # Act
    token = create_access_token(data=data)
    
    # Assert
    assert isinstance(token, str)
    assert len(token) > 0


def test_create_access_token_with_expires_delta():
    """Test that access token respects custom expiration time."""
    # Arrange
    data = {"sub": "123", "email": "test@example.com"}
    expires_delta = timedelta(minutes=30)
    
    # Act
    token = create_access_token(data=data, expires_delta=expires_delta)
    
    # Assert
    assert isinstance(token, str)
    assert len(token) > 0
    
    # Decode and verify expiration
    decoded = jwt.decode(token, os.getenv("BETTER_AUTH_SECRET", "fallback-test-secret-key-change-in-production"), algorithms=["HS256"])
    exp_time = datetime.utcfromtimestamp(decoded["exp"])
    issued_time = datetime.utcfromtimestamp(decoded["iat"])
    time_diff = exp_time - issued_time
    
    # Should be approximately 30 minutes
    assert abs(time_diff.total_seconds() - 1800) < 10  # Allow 10 seconds tolerance


def test_verify_token_valid():
    """Test that verify_token returns correct payload for valid token."""
    # Arrange
    data = {"sub": "123", "email": "test@example.com"}
    token = create_access_token(data=data)
    
    # Act
    result = verify_token(token)
    
    # Assert
    assert result is not None
    assert result["sub"] == "123"
    assert result["email"] == "test@example.com"


def test_verify_token_invalid():
    """Test that verify_token returns None for invalid token."""
    # Arrange
    invalid_token = "invalid.token.here"
    
    # Act
    result = verify_token(invalid_token)
    
    # Assert
    assert result is None


def test_decode_token_payload_without_verification():
    """Test that decode_token_payload returns payload without verification."""
    # Arrange
    data = {"sub": "123", "email": "test@example.com", "custom_field": "value"}
    token = create_access_token(data=data)
    
    # Act
    result = decode_token_payload(token)
    
    # Assert
    assert result is not None
    assert result["sub"] == "123"
    assert result["email"] == "test@example.com"
    assert result["custom_field"] == "value"