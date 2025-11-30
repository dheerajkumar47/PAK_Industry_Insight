from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")
print(f"URI: {uri}")

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=2000)
    client.admin.command('ping')
    print("MongoDB Connected Successfully!")
except Exception as e:
    print(f"Connection Failed: {e}")
