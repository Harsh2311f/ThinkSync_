import asyncio
from app.database import db

async def test():
    names = await db.list_collection_names()
    print("Connected. Collections:", names)

asyncio.run(test())