from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey123") # Fallback for dev
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    APP_NAME: str = "PAK Industry Insight API"

settings = Settings()
