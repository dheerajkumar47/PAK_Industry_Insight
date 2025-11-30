from pymongo import MongoClient
import sys

# Current SRV string (Failing)
uri = "mongodb://Friend_db:wBn5r9qtVYCkCkCB@ac-xv6ygzk-shard-00-00.hclwfbr.mongodb.net:27017,ac-xv6ygzk-shard-00-01.hclwfbr.mongodb.net:27017,ac-xv6ygzk-shard-00-02.hclwfbr.mongodb.net:27017/PAKIndustryDB?ssl=true&authSource=admin&retryWrites=true&w=majority"

print(f"Testing connection to: {uri}")

try:
    client = MongoClient(uri)
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("SUCCESS: Connected to MongoDB Atlas!")
except Exception as e:
    print(f"FAILURE: Could not connect.\nError: {e}")
