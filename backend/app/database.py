from pymongo import MongoClient
from .config import settings

import certifi

client = MongoClient(settings.MONGODB_URI, tls=True, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True)
db = client["PAKIndustryDB"]

try:
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    print("Please check your MONGODB_URI in .env file.")