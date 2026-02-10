from fastapi import HTTPException, Request, status
from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os
from jose import JWTError, jwt
from functools import wraps
from src.utils.jwt import verify_user_id_match, PUBLIC_KEY, ALGORITHM


class JWTBearer(HTTPBearer):
    """
    Custom JWT Bearer authentication scheme.
    
    This class extends FastAPI's HTTPBearer to provide custom JWT validation.
    """
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        """
        Validate the JWT token in the request.
        
        Args:
            request: The incoming request object
            
        Returns:
            The decoded token payload if valid
            
        Raises:
            HTTPException: If the token is invalid or missing
        """
        credentials: Optional[HTTPAuthorizationCredentials] = await super(
            JWTBearer, self
        ).__call__(request)
        
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Wrong authentication scheme."
                )
            token = credentials.credentials
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No credentials provided."
            )
        
        return self.verify_jwt(token)

    def verify_jwt(self, token: str) -> Optional[dict]:
        """
        Verify the JWT token and return the payload.
        
        Args:
            token: The JWT token to verify
            
        Returns:
            The decoded token payload if valid, None otherwise
        """
        try:
            payload = jwt.decode(token, PUBLIC_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None




def require_same_user_id():
    """
    Decorator to ensure the token user ID matches the URL user ID.
    
    This decorator can be applied to endpoints that require the authenticated
    user to be the same as the user being accessed via the URL parameter.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Extract token payload and user_id from kwargs
            token_payload = kwargs.get('token_payload')
            url_user_id = kwargs.get('user_id')
            
            if not token_payload or not url_user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Missing token payload or user ID"
                )
            
            if not verify_user_id_match(token_payload, url_user_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied: User ID mismatch"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator