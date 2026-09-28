import os

from dotenv import load_dotenv
from pymongo import AsyncMongoClient
from pymongo.errors import PyMongoError

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "thinksync")

client = AsyncMongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000,
)

db = client[DB_NAME]


async def ping_database() -> bool:
    try:
        await client.admin.command("ping")
        return True
    except PyMongoError:
        return False
