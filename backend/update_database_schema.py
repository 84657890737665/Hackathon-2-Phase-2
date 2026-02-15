#!/usr/bin/env python3
"""
Script to update the existing database schema with enterprise columns
"""

import os
import sqlite3
import sys
from pathlib import Path

def update_database_schema():
    db_path = "todo_app.db"
    
    if not os.path.exists(db_path):
        print(f"Database file {db_path} not found. Creating new database...")
        # Import and run the create_db_and_tables function to create the database
        sys.path.insert(0, str(Path(__file__).parent))
        from src.db.database import create_db_and_tables
        create_db_and_tables()
        print("New database created with enterprise schema!")
        return
    
    print("Updating existing database schema...")
    
    # Connect to the database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check existing columns in the user table
    cursor.execute("PRAGMA table_info(user)")
    existing_columns = [row[1] for row in cursor.fetchall()]
    print(f"Existing user table columns: {existing_columns}")
    
    # Define the enterprise columns that should exist
    enterprise_columns = [
        ('status', 'TEXT', "'ACTIVE'"),
        ('points_balance', 'INTEGER', '0'),
        ('streak_count', 'INTEGER', '0'),
        ('total_tasks_completed', 'INTEGER', '0'),
        ('last_completion_date', 'DATETIME', 'NULL'),
        ('completion_rate', 'REAL', '0.0'),
        ('execution_velocity', 'REAL', '0.0'),
        ('focus_consistency', 'REAL', '0.0'),
        ('collaboration_efficiency', 'REAL', '0.0')
    ]
    
    # Add missing columns
    for col_name, col_type, default_val in enterprise_columns:
        if col_name not in existing_columns:
            try:
                if default_val == 'NULL':
                    cursor.execute(f'ALTER TABLE user ADD COLUMN {col_name} {col_type}')
                else:
                    cursor.execute(f'ALTER TABLE user ADD COLUMN {col_name} {col_type} DEFAULT {default_val}')
                print(f"[SUCCESS] Added column: {col_name}")
            except sqlite3.OperationalError as e:
                print(f"[WARNING] Column {col_name} already exists or error: {e}")
        else:
            print(f"[SUCCESS] Column {col_name} already exists")
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print("\nDatabase schema updated successfully with enterprise columns!")
    
    # Verify the schema
    print("\nVerifying schema...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check user table columns
    cursor.execute("PRAGMA table_info(user)")
    user_columns = [row[1] for row in cursor.fetchall()]
    print(f"Updated user table columns: {user_columns}")
    
    conn.close()

if __name__ == "__main__":
    update_database_schema()