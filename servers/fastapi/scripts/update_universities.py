import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path to import app modules
current_file = Path(__file__).resolve()
server_dir = current_file.parent.parent
sys.path.append(str(server_dir))

# Load .env
env_path = Path(server_dir).parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)
    print(f"Loaded .env from {env_path}")

from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from services.database import sql_engine, create_db_and_tables
from models.sql.university import UniversityModel

# List of universities to add/update
UNIVERSITIES = [
    {"name": "浙江大学", "code": "4133010335", "location": "杭州", "alias": "zju"},
    {"name": "浙江工业大学", "code": "4133010337", "location": "杭州", "alias": "zjut"},
    {"name": "杭州电子科技大学", "code": "4133010336", "location": "杭州", "alias": "hdu"},
    {"name": "浙江科技大学", "code": "4133011057", "location": "杭州", "alias": "zust"},
    {"name": "浙江理工大学", "code": "4133010338", "location": "杭州", "alias": None},
    {"name": "宁波大学", "code": "4133011646", "location": "宁波", "alias": None},
    {"name": "浙江工商大学", "code": "4133010353", "location": "杭州", "alias": None},
    {"name": "温州医科大学", "code": "4133010343", "location": "温州", "alias": None},
    {"name": "浙江中医药大学", "code": "4133010344", "location": "杭州", "alias": None},
    {"name": "中国计量大学", "code": "4133010356", "location": "杭州", "alias": None},
    {"name": "浙江师范大学", "code": "4133010345", "location": "金华", "alias": None},
    {"name": "杭州师范大学", "code": "4133010346", "location": "杭州", "alias": None},
    {"name": "浙江农林大学", "code": "4133010341", "location": "杭州", "alias": None},
    {"name": "浙江海洋大学", "code": "4133010340", "location": "舟山", "alias": None},
    {"name": "浙江传媒学院", "code": "4133011482", "location": "杭州", "alias": None},
    {"name": "浙江财经大学", "code": "4133011483", "location": "杭州", "alias": None},
    {"name": "嘉兴大学", "code": "4133010354", "location": "嘉兴", "alias": None},
    {"name": "绍兴文理学院", "code": "4133010349", "location": "绍兴", "alias": None},
    {"name": "台州学院", "code": "4133010350", "location": "台州", "alias": None},
    {"name": "丽水学院", "code": "4133010352", "location": "丽水", "alias": None},
    {"name": "衢州学院", "code": "4133011488", "location": "衢州", "alias": None},
    {"name": "湖州师范学院", "code": "4133010347", "location": "湖州", "alias": None},
    {"name": "温州大学", "code": "4133010351", "location": "温州", "alias": None},
    {"name": "浙江外国语学院", "code": "4133014275", "location": "杭州", "alias": None},
    {"name": "浙江树人学院", "code": "4133011842", "location": "杭州", "alias": None},
    {"name": "浙江越秀外国语学院", "code": "4133012792", "location": "绍兴", "alias": None},
    {"name": "宁波工程学院", "code": "4133011058", "location": "宁波", "alias": None},
    {"name": "杭州医学院", "code": "4133011647", "location": "杭州", "alias": None},
    {"name": "浙大城市学院", "code": "4133013021", "location": "杭州", "alias": None},
    {"name": "浙大宁波理工学院", "code": "4133013022", "location": "宁波", "alias": None},
    {"name": "北京大学", "code": "4111010001", "location": "北京", "alias": "pku"},
    {"name": "清华大学", "code": "4111010003", "location": "北京", "alias": "tsinghua"},
    {"name": "复旦大学", "code": "4131010246", "location": "上海", "alias": "fudan"},
    {"name": "上海交通大学", "code": "4131010248", "location": "上海", "alias": "sjtu"},
]

async def update_universities():
    print("Ensuring database tables exist...")
    await create_db_and_tables()
    print(f"Updating {len(UNIVERSITIES)} universities...")
    async with AsyncSession(sql_engine) as session:
        count = 0
        for data in UNIVERSITIES:
            statement = select(UniversityModel).where(UniversityModel.name == data["name"])
            result = await session.execute(statement)
            existing = result.scalars().first()
            
            if existing:
                updated = False
                # If alias is provided in our data, update it
                if data["alias"] and existing.alias != data["alias"]:
                    existing.alias = data["alias"]
                    updated = True
                    print(f"Updated alias for {data['name']} -> {data['alias']}")
                
                # If code is missing in DB, update it
                if not existing.code and data["code"]:
                    existing.code = data["code"]
                    updated = True
                
                if updated:
                    session.add(existing)
                    count += 1
            else:
                # Create new
                new_uni = UniversityModel(
                    name=data["name"],
                    code=data["code"],
                    location=data["location"],
                    alias=data["alias"],
                    department="教育厅",
                    level="本科"
                )
                session.add(new_uni)
                print(f"Added new university: {data['name']}")
                count += 1
        
        await session.commit()
        print(f"Successfully processed. {count} changes made.")

if __name__ == "__main__":
    asyncio.run(update_universities())
