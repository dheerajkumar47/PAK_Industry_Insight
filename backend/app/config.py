from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    # IMPORTANT: Never hardcode sensitive values here!
    # All sensitive values must be set via environment variables or .env file
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    APP_NAME: str = "PAK Industry Insight API"
    GOOGLE_CLIENT_ID: str = os.getenv("VITE_GOOGLE_CLIENT_ID", "")

settings = Settings()
