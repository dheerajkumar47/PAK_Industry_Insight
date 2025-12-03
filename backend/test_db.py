from pymongo import MongoClient
from app.config import settings
import sys

# Use URI from settings
uri = settings.MONGODB_URI

print(f"Testing connection to: {uri}")

try:
    client = MongoClient(uri)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("SUCCESS: Connected to MongoDB Atlas!")
except Exception as e:
    print(f"FAILURE: Could not connect.\nError: {e}")
