from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    print("Attempting to hash '1234'...")
    hash = pwd_context.hash("1234")
    print(f"Success! Hash: {hash}")
except Exception as e:
    print(f"Error: {e}")
