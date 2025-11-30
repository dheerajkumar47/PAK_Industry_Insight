from pymongo import MongoClient
from app.config import settings

# Connect to Cloud DB
client = MongoClient(settings.MONGODB_URI)
db = client["PAKIndustryDB"]
users_collection = db["users"]

print(f"Connected to Database: {db.name}")
print(f"Collection: {users_collection.name}")
print("-" * 30)

# Fetch all users
users = list(users_collection.find({}, {"_id": 0, "hashed_password": 0})) # Exclude sensitive data

if not users:
    print("No users found yet.")
else:
    print(f"Found {len(users)} user(s):")
    for user in users:
        print(f"- Name: {user.get('full_name')}, Email: {user.get('email')}")
