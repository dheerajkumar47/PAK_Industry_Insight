from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://Friend_db:wBn5r9qtVYCkCkCB@ac-xv6ygzk-shard-00-00.hclwfbr.mongodb.net:27017,ac-xv6ygzk-shard-00-01.hclwfbr.mongodb.net:27017,ac-xv6ygzk-shard-00-02.hclwfbr.mongodb.net:27017/PAKIndustryDB?ssl=true&authSource=admin&retryWrites=true&w=majority")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey123") # Fallback for dev
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    APP_NAME: str = "PAK Industry Insight API"

settings = Settings()
