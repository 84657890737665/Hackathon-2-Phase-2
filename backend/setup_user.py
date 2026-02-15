import sys
import os
sys.path.append(os.getcwd())

from sqlmodel import Session, select
from src.db.database import engine, create_db_and_tables
from src.models.user import User
from src.utils.jwt import get_password_hash
from datetime import datetime

def setup_test_user(email, password):
    print(f"--- Setting up test user: {email} ---")
    try:
        # Step 1: Ensure tables exist
        print("Ensuring tables exist...")
        create_db_and_tables()
        print("Schema verification complete.")

        # Step 2: Setup user
        with Session(engine) as session:
            statement = select(User).where(User.email == email)
            user = session.exec(statement).first()
            
            hashed_pw = get_password_hash(password)
            
            if user:
                print(f"User {email} exists. Updating password...")
                user.hashed_password = hashed_pw
                user.updated_at = datetime.now()
                user.full_name = "Tanzeel Arshad" # Ensure name is set
                session.add(user)
            else:
                print(f"User {email} not found. Creating new user...")
                user = User(
                    email=email,
                    hashed_password=hashed_pw,
                    full_name="Tanzeel Arshad",
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                session.add(user)
            
            session.commit()
            print("Setup successful.")
            
    except Exception as e:
        import traceback
        print(f"Error setting up user: {str(e)}")
        traceback.print_exc()

if __name__ == "__main__":
    setup_test_user("tanzeelaarshad320@gmail.com", "Password123!")
