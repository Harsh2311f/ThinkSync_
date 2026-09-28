"""
ThinkSync - MongoDB index setup
Run this ONCE, after you have imported all the .jsonl files.

    pip install pymongo
    python setup_indexes.py

Without indexes, MongoDB reads every document on every query. With 30,000
train movements your opportunity-window search would take seconds instead
of milliseconds. Always index before you build the API.
"""

import os

from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING, DESCENDING, GEOSPHERE

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "thinksync")

db = MongoClient(MONGO_URI)[DB_NAME]

INDEXES = {
    "maintenance_tasks": [
        # "show me tasks on this section, newest first"
        [("section_id", ASCENDING), ("event_datetime", DESCENDING)],
        # "show me the overdue critical work" - the priority queue
        [("schedule.is_overdue", ASCENDING), ("labels.risk_score", DESCENDING)],
        [("labels.severity", ASCENDING)],
        [("department", ASCENDING), ("dataset", ASCENDING)],
    ],
    "train_movements": [
        # "which trains cross this section in this time range" - conflict check
        [("section_id", ASCENDING), ("scheduled_entry", ASCENDING)],
        # "how busy is this section at 2 AM" - opportunity window search
        [("section_id", ASCENDING), ("hour", ASCENDING)],
        [("train_category", ASCENDING)],
    ],
    "resources": [
        # "what crew is free on this section during this window"
        [("section_id", ASCENDING), ("available_from", ASCENDING), ("available_to", ASCENDING)],
        [("department", ASCENDING), ("resource_type", ASCENDING)],
    ],
    "block_history": [
        [("section_id", ASCENDING), ("block_start", DESCENDING)],
        [("overrun_flag", ASCENDING)],
    ],
    "sections": [
        [("section_id", ASCENDING)],
        [("division", ASCENDING)],
    ],
}

for collection, keys in INDEXES.items():
    for key in keys:
        name = db[collection].create_index(key)
        print(f"  {collection:20s} -> {name}")

# Geospatial index so the dashboard can do "sections near this point"
db.stations.create_index([("location", GEOSPHERE)])
db.sections.create_index([("origin_geo", GEOSPHERE)])
print("  stations / sections  -> 2dsphere geo indexes")

print("\nCollection counts:")
for c in sorted(db.list_collection_names()):
    print(f"  {c:22s} {db[c].count_documents({}):>7,}")
