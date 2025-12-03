from app.config import settings
import os
from dotenv import load_dotenv

# Force reload .env to be sure
load_dotenv()

print("--- Backend Configuration Verification (Retry) ---")
print(f"Current Working Directory: {os.getcwd()}")
print(f"GOOGLE_CLIENT_ID from settings: '{settings.GOOGLE_CLIENT_ID}'")
print(f"VITE_GOOGLE_CLIENT_ID env var: '{os.getenv('VITE_GOOGLE_CLIENT_ID')}'")
print("--------------------------------------------------")
