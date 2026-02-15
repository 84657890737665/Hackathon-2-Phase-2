#!/usr/bin/env python3
"""
Script to reset the database with the correct schema
"""

import os
import sqlite3
from src.db.database import create_db_and_tables

def reset_database():
    # Remove the existing database file
    db_path = "todo_app.db"
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")
    
    # Create the database with the correct schema
    print("Creating database with correct schema...")
    create_db_and_tables()
    print("Database reset complete!")

if __name__ == "__main__":
    reset_database()