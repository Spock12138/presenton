import asyncio
import os
import sys
import glob
from pathlib import Path
import pandas as pd
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
from services.database import get_async_session, create_db_and_tables
from models.sql.university import UniversityModel

# Define mocked data to simulate the official file structure
MOCK_DATA = [
    {"序号": 1, "学校名称": "北京大学", "学校标识码": "4111010001", "主管部门": "教育部", "所在地": "北京市", "办学层次": "本科", "备注": ""},
    {"序号": 2, "学校名称": "中国人民大学", "学校标识码": "4111010002", "主管部门": "教育部", "所在地": "北京市", "办学层次": "本科", "备注": ""},
    {"序号": 3, "学校名称": "清华大学", "学校标识码": "4111010003", "主管部门": "教育部", "所在地": "北京市", "办学层次": "本科", "备注": ""},
    {"序号": 36, "学校名称": "浙江大学", "学校标识码": "4133010335", "主管部门": "教育部", "所在地": "浙江省", "办学层次": "本科", "备注": ""},
    {"序号": 37, "学校名称": "浙江工业大学", "学校标识码": "4133010337", "主管部门": "浙江省", "所在地": "浙江省", "办学层次": "本科", "备注": ""},
    {"序号": 38, "学校名称": "杭州电子科技大学", "学校标识码": "4133010336", "主管部门": "浙江省", "所在地": "浙江省", "办学层次": "本科", "备注": ""},
    {"序号": 39, "学校名称": "复旦大学", "学校标识码": "4131010246", "主管部门": "教育部", "所在地": "上海市", "办学层次": "本科", "备注": ""},
    {"序号": 40, "学校名称": "上海交通大学", "学校标识码": "4131010248", "主管部门": "教育部", "所在地": "上海市", "办学层次": "本科", "备注": ""},
    {"序号": 41, "学校名称": "浙江科技大学", "学校标识码": "4133011057", "主管部门": "浙江省", "所在地": "浙江省", "办学层次": "本科", "备注": ""},
    {"序号": 42, "学校名称": "杭州师范大学", "学校标识码": "4133010346", "主管部门": "浙江省", "所在地": "浙江省", "办学层次": "本科", "备注": ""},
]

async def import_data():
    print("Initializing database...")
    await create_db_and_tables()
    
    app_data_dir = os.getenv("APP_DATA_DIRECTORY", "E:/presenton/app_data")
    if not os.path.exists(app_data_dir):
        os.makedirs(app_data_dir)
        
    # Find all excel files
    excel_files = glob.glob(os.path.join(app_data_dir, "*.xls*"))
    
    if not excel_files:
        print(f"No Excel files found in {app_data_dir}")
        print("Creating mock data file for demonstration...")
        mock_file = os.path.join(app_data_dir, "universities.xlsx")
        df = pd.DataFrame(MOCK_DATA)
        try:
            df.to_excel(mock_file, index=False)
            print(f"Created sample file at: {mock_file}")
            excel_files = [mock_file]
        except Exception as e:
            print(f"Could not save sample file (pandas/openpyxl might be missing): {e}")
            return
    else:
        print(f"Found {len(excel_files)} Excel files: {[os.path.basename(f) for f in excel_files]}")

    total_imported = 0
    
    async for session in get_async_session():
        for file_path in excel_files:
            if os.path.basename(file_path).startswith("~$"): # Skip temp files
                continue
                
            print(f"Processing {os.path.basename(file_path)}...")
            try:
                df = pd.read_excel(file_path)
                # Ensure we handle nan values correctly
                df = df.fillna("")
                
                count = 0
                for _, row in df.iterrows():
                    name = row.get("学校名称")
                    if not name:
                        continue
                    
                    # Check if exists
                    stmt = select(UniversityModel).where(UniversityModel.name == name)
                    result = await session.execute(stmt)
                    existing = result.scalar_one_or_none()
                    
                    if existing:
                        continue
                    
                    # Handle code being int or float or string
                    code_val = row.get("学校标识码", "")
                    if hasattr(code_val, 'is_integer') and code_val.is_integer():
                         code_val = int(code_val)
                    code_str = str(code_val).strip()
                    
                    university = UniversityModel(
                        name=str(name).strip(),
                        code=code_str,
                        department=str(row.get("主管部门", "")).strip(),
                        location=str(row.get("所在地", "")).strip(),
                        level=str(row.get("办学层次", "")).strip(),
                        category=str(row.get("备注", "")).strip()
                    )
                    session.add(university)
                    count += 1
                
                await session.commit()
                print(f"Imported {count} new universities from {os.path.basename(file_path)}")
                total_imported += count
                
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
                import traceback
                traceback.print_exc()

    print(f"Total imported: {total_imported}")

if __name__ == "__main__":
    asyncio.run(import_data())
