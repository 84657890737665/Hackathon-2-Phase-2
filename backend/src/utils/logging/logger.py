import logging
import sys
from datetime import datetime
from enum import Enum


class LogLevel(Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


def setup_logger(name: str = __name__, level: LogLevel = LogLevel.INFO) -> logging.Logger:
    """
    Set up a logger with the specified name and level.
    
    Args:
        name: Name of the logger
        level: Log level (default INFO)
    
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)  # Set to lowest level, let handlers filter
    
    # Prevent duplicate handlers
    if logger.handlers:
        return logger
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, level.value))
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    
    # Add handler to logger
    logger.addHandler(console_handler)
    
    return logger


def log_exception(logger: logging.Logger, message: str = "An exception occurred"):
    """
    Log an exception with traceback.
    
    Args:
        logger: Logger instance
        message: Message to log with the exception
    """
    logger.exception(message)


def log_api_call(
    logger: logging.Logger, 
    endpoint: str, 
    method: str, 
    user_id: int = None, 
    status_code: int = None
):
    """
    Log an API call with relevant details.
    
    Args:
        logger: Logger instance
        endpoint: API endpoint that was called
        method: HTTP method used
        user_id: ID of the user making the request (optional)
        status_code: HTTP status code of the response (optional)
    """
    user_info = f"User: {user_id}" if user_id else "User: Anonymous"
    status_info = f"Status: {status_code}" if status_code else ""
    
    logger.info(f"API Call - {method} {endpoint} | {user_info} | {status_info}")


def log_security_event(
    logger: logging.Logger,
    event_type: str,
    user_id: int = None,
    ip_address: str = None,
    details: str = None
):
    """
    Log a security-related event.
    
    Args:
        logger: Logger instance
        event_type: Type of security event
        user_id: ID of the user involved (optional)
        ip_address: IP address of the request (optional)
        details: Additional details about the event (optional)
    """
    user_info = f"User: {user_id}" if user_id else "User: Unknown"
    ip_info = f"IP: {ip_address}" if ip_address else "IP: Unknown"
    details_info = f"Details: {details}" if details else ""
    
    logger.warning(f"Security Event - {event_type} | {user_info} | {ip_info} | {details_info}")