import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to sys.path to allow importing services
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
sys.path.append(str(parent_dir))

# Load .env first
env_path = parent_dir.parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)
    print(f"Loaded .env from {env_path}")

import asyncio
from sqlalchemy import text
from services.database import sql_engine

async def drop_table():
    print("Dropping universities table...")
    async with sql_engine.begin() as conn:
        await conn.execute(text("DROP TABLE IF EXISTS universities"))
        print("Dropped universities table.")

if __name__ == "__main__":
    asyncio.run(drop_table())