import sys
sys.path.append('./backend')

from src.utils.jwt import get_password_hash

# Test with a simple password
password = "Test1234!"
print(f"Original password: {password}")
print(f"Password length in bytes: {len(password.encode('utf-8'))}")

try:
    hashed = get_password_hash(password)
    print(f"Password hashed successfully: {hashed[:20]}...")
except Exception as e:
    print(f"Error hashing password: {e}")