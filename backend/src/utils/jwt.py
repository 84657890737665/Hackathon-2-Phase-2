from datetime import datetime, timedelta
from typing import Optional
import os
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import timezone

from src.utils.logging.logger import setup_logger

# Initialize logger
logger = setup_logger(__name__)


# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b", bcrypt__rounds=12)

# RS256 Configuration
ALGORITHM = "RS256"
ISSUER = "todo-app-api"
AUDIENCE = "todo-app-frontend"

# Load RSA keys
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CERT_DIR = os.path.join(BASE_DIR, "certs")

try:
    with open(os.path.join(CERT_DIR, "private_key.pem"), "rb") as f:
        PRIVATE_KEY = f.read()
    with open(os.path.join(CERT_DIR, "public_key.pem"), "rb") as f:
        PUBLIC_KEY = f.read()
except FileNotFoundError:
    logger.error("RSA keys not found in src/certs/. Please run key generation.")
    PRIVATE_KEY = os.getenv("PRIVATE_KEY_FALLBACK")  # Not ideal for prod
    PUBLIC_KEY = os.getenv("PUBLIC_KEY_FALLBACK")

ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.

    Args:
        plain_password: The plain text password to verify
        hashed_password: The hashed password to compare against

    Returns:
        True if the password matches, False otherwise
    """
    # Ensure password is properly truncated before sending to bcrypt
    # bcrypt has a 72-byte limit, so we need to truncate at byte level, not character level
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        # Take the first 72 bytes and decode back to string
        plain_password = password_bytes[:72].decode('utf-8', errors='ignore')
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a hash for a plain password.

    Args:
        password: The plain text password to hash

    Returns:
        The hashed password
    """
    # Ensure password is properly truncated before sending to bcrypt
    # bcrypt has a 72-byte limit, so we need to truncate at byte level, not character level
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        # Take the first 72 bytes and decode back to string
        password = password_bytes[:72].decode('utf-8', errors='ignore')
    result = pwd_context.hash(password)
    return result


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create an access token with the provided data.
    
    Args:
        data: The data to encode in the token
        expires_delta: Optional expiration time delta (defaults to 7 days)
        
    Returns:
        The encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iss": ISSUER,
        "aud": AUDIENCE
    })
    encoded_jwt = jwt.encode(to_encode, PRIVATE_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    Verify a JWT token and return the decoded data.
    
    Args:
        token: The JWT token to verify
        
    Returns:
        The decoded token data if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=[ALGORITHM], audience=AUDIENCE, issuer=ISSUER)
        return payload
    except JWTError:
        return None


def decode_token_payload(token: str) -> Optional[dict]:
    """
    Decode the payload of a JWT token without verification.

    Args:
        token: The JWT token to decode

    Returns:
        The decoded token data if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, key="", options={"verify_signature": False, "verify_exp": False, "verify_nbf": False})
        return payload
    except JWTError:
        return None


def create_refresh_token(data: dict) -> str:
    """
    Create a refresh token with the provided data.

    Args:
        data: The data to encode in the token

    Returns:
        The encoded refresh JWT token
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({
        "exp": expire, 
        "type": "refresh",
        "iss": ISSUER,
        "aud": AUDIENCE
    })
    encoded_jwt = jwt.encode(to_encode, PRIVATE_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_refresh_token(token: str) -> Optional[dict]:
    """
    Verify a refresh token and return the decoded data.

    Args:
        token: The refresh JWT token to verify

    Returns:
        The decoded token data if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=[ALGORITHM], audience=AUDIENCE, issuer=ISSUER)
        token_type = payload.get("type")
        if token_type != "refresh":
            return None
        return payload
    except JWTError:
        return None


def verify_user_id_match(token_payload: dict, url_user_id: int) -> bool:
    """
    Verify that the user ID in the JWT token matches the user ID in the URL.
    
    Args:
        token_payload: The decoded JWT token payload
        url_user_id: The user ID from the URL path
        
    Returns:
        True if the user IDs match, False otherwise
    """
    token_user_id = token_payload.get("user_id") or token_payload.get("sub")
    
    if token_user_id is None:
        return False
    
    # Convert to int for comparison if needed
    try:
        token_user_id = int(token_user_id)
    except (ValueError, TypeError):
        return False
    
    return token_user_id == url_user_id