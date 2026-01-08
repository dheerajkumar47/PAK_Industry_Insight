from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from dotenv import load_dotenv
import os

# Explicitly load .env file
load_dotenv()

class Settings(BaseSettings):
    # IMPORTANT: Never hardcode sensitive values here!
    # All sensitive values must be set via environment variables or .env file
    MONGODB_URI: str = ""
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    APP_NAME: str = "PAK Industry Insight API"
    # Look for GOOGLE_CLIENT_ID first, fallback to VITE_GOOGLE_CLIENT_ID for backward compatibility
    GOOGLE_CLIENT_ID: str = Field(default="", validation_alias="VITE_GOOGLE_CLIENT_ID")
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()