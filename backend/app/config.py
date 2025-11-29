from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    APP_NAME: str = "PAK Industry Insight API"

settings = Settings()