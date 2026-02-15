#!/usr/bin/env python3
"""
Script to reset the database with the correct schema for enterprise features
"""

import os
import sys
import sqlite3
from pathlib import Path

# Add the src directory to the path so we can import the models
sys.path.insert(0, str(Path(__file__).parent))

from src.db.database import create_db_and_tables

def reset_database():
    # Remove the existing database file
    db_path = "todo_app.db"
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")
    else:
        print(f"Database file {db_path} not found, will create new one")
    
    # Create the database with the correct schema
    print("Creating database with correct schema...")
    create_db_and_tables()
    print("Database reset complete with enterprise schema!")
    
    # Verify the schema
    print("\nVerifying schema...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check user table columns
    cursor.execute("PRAGMA table_info(user)")
    user_columns = [row[1] for row in cursor.fetchall()]
    print(f"User table columns: {user_columns}")
    
    # Check if enterprise columns exist
    enterprise_columns = [
        'points_balance',
        'streak_count', 
        'completion_rate',
        'execution_velocity',
        'focus_consistency',
        'collaboration_efficiency'
    ]
    
    missing_columns = [col for col in enterprise_columns if col not in user_columns]
    if missing_columns:
        print(f"❌ Missing enterprise columns: {missing_columns}")
    else:
        print("✅ All enterprise columns present")
    
    conn.close()

if __name__ == "__main__":
    reset_database()