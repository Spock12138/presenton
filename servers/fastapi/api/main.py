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
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from api.lifespan import app_lifespan
from api.middlewares import UserConfigEnvUpdateMiddleware
from api.v1.ppt.router import API_V1_PPT_ROUTER
from api.v1.webhook.router import API_V1_WEBHOOK_ROUTER
from api.v1.mock.router import API_V1_MOCK_ROUTER


app = FastAPI(lifespan=app_lifespan)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"Validation Error: {exc}")
    return JSONResponse(
        status_code=422,
        content={"detail": str(exc), "errors": exc.errors()},
    )


# Routers
app.include_router(API_V1_PPT_ROUTER)
app.include_router(API_V1_WEBHOOK_ROUTER)
app.include_router(API_V1_MOCK_ROUTER)

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
