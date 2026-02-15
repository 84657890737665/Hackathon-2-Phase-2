from pydantic_settings import BaseSettings
from typing import List, Optional
import os
import sys
# Load environment variables from .env file
from dotenv import load_dotenv
import os

# Get the base directory (backend folder: src/config/.. -> src/.. -> backend)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_PATH = os.path.join(BASE_DIR, ".env")

# Try to load from specific path, then from CWD
if os.path.exists(ENV_PATH):
    load_dotenv(ENV_PATH)
else:
    load_dotenv()

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # Database settings
    DATABASE_URL: str

    # Authentication settings
    BETTER_AUTH_SECRET: str

    # API settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://0.0.0.0:3000,https://taskflow.works,https://www.taskflow.works"

    # Security settings
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"

    # Security headers
    SECURITY_FORCE_HTTPS: bool = False
    SECURITY_HSTS_MAX_AGE: int = 0  # Temporarily clear HSTS for local development
    SECURITY_HSTS_INCLUDE_SUBDOMAINS: bool = True
    SECURITY_HSTS_PRELOAD: bool = True
    SECURITY_CONTENT_TYPE_NOSNIFF: bool = True
    SECURITY_XSS_PROTECTION: bool = True
    SECURITY_FRAME_DENY: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"


def validate_environment():
    """
    Validates that all required environment variables are set.
    Exits the application if any required variables are missing.
    """
    required_vars = [
        "DATABASE_URL",
        "BETTER_AUTH_SECRET"
    ]
    
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"ERROR: Missing required environment variables: {', '.join(missing_vars)}")
        print("\nPlease set these variables in your .env file or environment.")
        print("\nExample .env file:")
        print("DATABASE_URL=postgresql://username:password@host:port/database")
        print("BETTER_AUTH_SECRET=your-super-secret-jwt-signing-key-change-in-production")
        print("API_HOST=0.0.0.0")
        print("API_PORT=8000")
        print("ALLOWED_ORIGINS=http://localhost:3000")
        print("DEBUG=False")
        print("LOG_LEVEL=INFO")
        sys.exit(1)
    
    # Validate specific requirements
    database_url = os.getenv("DATABASE_URL", "")
    if not database_url.startswith(("postgresql://", "sqlite://")):
        print("ERROR: DATABASE_URL must start with 'postgresql://' or 'sqlite://'")
        sys.exit(1)
    
    auth_secret = os.getenv("BETTER_AUTH_SECRET", "")
    if len(auth_secret) < 32:
        print("WARNING: BETTER_AUTH_SECRET should be at least 32 characters long for security")
    
    print("Environment validation passed!")


# Create settings instance
settings = Settings()