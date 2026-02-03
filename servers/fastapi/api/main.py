import os
from pathlib import Path
from dotenv import load_dotenv

# 加载项目根目录的 .env 文件
# 使用绝对路径确保正确加载
current_file = Path(__file__).resolve()
fastapi_dir = current_file.parent.parent  # servers/fastapi
servers_dir = fastapi_dir.parent  # servers
project_root = servers_dir.parent  # 项目根目录
env_path = project_root / ".env"

print(f"正在加载 .env 文件: {env_path}")
print(f"文件存在: {env_path.exists()}")

if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"✅ .env 文件加载成功")
    print(f"APP_DATA_DIRECTORY: {os.getenv('APP_DATA_DIRECTORY')}")
else:
    print(f"⚠️ .env 文件不存在: {env_path}")

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from api.lifespan import app_lifespan
from api.middlewares import UserConfigEnvUpdateMiddleware
from api.v1.ppt.router import API_V1_PPT_ROUTER
from api.v1.webhook.router import API_V1_WEBHOOK_ROUTER
from api.v1.mock.router import API_V1_MOCK_ROUTER
from utils.get_env import get_app_data_directory_env
from api.v1.templates.router import API_V1_TEMPLATES_ROUTER


app = FastAPI(lifespan=app_lifespan)

# Mount static files
app_data_dir = get_app_data_directory_env()
if app_data_dir and os.path.exists(app_data_dir):
    app.mount("/app_data", StaticFiles(directory=app_data_dir), name="app_data")
    print(f"✅ Static mount: /app_data -> {app_data_dir}")

static_dir = os.path.join(fastapi_dir, "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
    print(f"✅ Static mount: /static -> {static_dir}")

# Routers
app.include_router(API_V1_PPT_ROUTER)
app.include_router(API_V1_WEBHOOK_ROUTER)
app.include_router(API_V1_MOCK_ROUTER)
app.include_router(API_V1_TEMPLATES_ROUTER)

# Middlewares
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(UserConfigEnvUpdateMiddleware)
