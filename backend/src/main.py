import os
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import Response
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from prometheus_client import Counter, Histogram
import time

from src.config.settings import validate_environment, settings

# Metrics for monitoring
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total number of requests',
    ['method', 'endpoint', 'status']
)

REQUEST_TIME = Histogram(
    'http_request_duration_seconds',
    'Request duration in seconds',
    ['method', 'endpoint']
)

from src.db.database import create_db_and_tables
from src.api.routes import auth, tasks


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan event handler.

    This function runs startup and shutdown events for the application.
    Currently, it handles environment validation and database initialization on startup.
    """
    # Run startup events
    print("Validating environment variables...")
    validate_environment()
    print("Environment validation completed!")
    
    print("Initializing database tables...")
    create_db_and_tables()
    print("Database tables initialized successfully!")

    yield  # Application runs during this period

    # Run shutdown events (if any)
    print("Shutting down...")


# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Create FastAPI app with lifespan
app = FastAPI(
    title="Todo App API",
    description="Backend API for the Todo application",
    version="1.0.0",
    lifespan=lifespan
)

# Custom exception handlers for specification alignment (message vs detail)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"message": "Request validation failed", "details": exc.errors()},
    )

# Add security headers using middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from typing import Callable

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = f"max-age={settings.SECURITY_HSTS_MAX_AGE}; includeSubDomains; preload"
        return response

# Add security middleware
app.add_middleware(SecurityHeadersMiddleware)

# Add rate limiting exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add trusted host middleware for security
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", ".ngrok.io", "0.0.0.0"]
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),  # Use validated settings
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router)
app.include_router(tasks.router)
from src.api.routes import gamification
app.include_router(gamification.router)

@app.get("/")
def read_root():
    """
    Root endpoint for the API.
    
    Returns a welcome message and API status information.
    """
    return {
        "message": "Welcome to the Todo API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/auth/",
            "tasks": "/api/{user_id}/tasks/"
        }
    }

@app.get("/health")
def health_check():
    """
    Health check endpoint (liveness probe).

    Returns the health status of the API.
    """
    import time
    from sqlmodel import select
    from src.models.user import User
    from src.db.database import engine
    
    start_time = time.time()
    
    # Perform basic health checks
    checks = {}
    
    # Check database connection
    try:
        with engine.connect() as conn:
            # Execute a simple query to test the connection
            result = conn.execute(select(User).limit(1))
            checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {str(e)}"
    
    # Cache check placeholder (would implement if using cache)
    checks["cache"] = "ok"
    
    # Disk space check placeholder (would implement if needed)
    checks["disk_space"] = "ok"
    
    # Calculate response time
    response_time = round((time.time() - start_time) * 1000, 2)
    
    # Determine overall status
    overall_status = "healthy" if all(value == "ok" for value in checks.values()) else "unhealthy"
    
    return {
        "status": overall_status,
        "service": "Todo API",
        "timestamp": __import__('datetime').datetime.now().isoformat(),
        "response_time_ms": response_time,
        "checks": checks
    }


@app.get("/ready")
def readiness_check():
    """
    Readiness check endpoint.

    Returns whether the service is ready to accept traffic.
    """
    # For now, just return healthy, but in a real app you might check
    # if all required services are available
    return {
        "status": "ready",
        "service": "Todo API",
        "timestamp": __import__('datetime').datetime.now().isoformat()
    }


@app.get("/metrics")
def get_metrics():
    """
    Metrics endpoint for Prometheus monitoring.
    
    Returns application metrics in Prometheus format.
    """
    from prometheus_client import generate_latest
    return Response(content=generate_latest(), media_type="text/plain")


# Middleware to track metrics
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        # Track request time
        REQUEST_TIME.labels(method=request.method, endpoint=request.url.path).observe(
            time.time() - start_time
        )
        
        # Track request count
        REQUEST_COUNT.labels(
            method=request.method, 
            endpoint=request.url.path, 
            status=response.status_code
        ).inc()
        
        return response


# Add metrics middleware
app.add_middleware(MetricsMiddleware)