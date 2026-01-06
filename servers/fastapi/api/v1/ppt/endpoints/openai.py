from typing import Annotated, List
from fastapi import APIRouter, Body, HTTPException

from utils.available_models import list_available_openai_compatible_models

OPENAI_ROUTER = APIRouter(prefix="/openai", tags=["OpenAI"])


@OPENAI_ROUTER.post("/models/available", response_model=List[str])
async def get_available_models(
    url: Annotated[str, Body()],
    api_key: Annotated[str, Body()],
):
    # --- 修改开始：直接硬编码返回模型列表 ---
    
    # 打印一条日志，方便你在终端确认这个函数被调用了
    print("🚀 [Hardcoded] 正在强制返回通义千问模型列表...")
    
    # 直接返回通义千问的模型 ID 列表
    # 这些 ID 必须是阿里云 DashScope 实际支持的 ID
    return [
        "qwen-plus",
        "qwen-max",
        "qwen-turbo",
        "qwen-long"
    ]
    
    # --- 修改结束 ---

    # 下面原本的逻辑注释掉或删掉：
    # try:
    #     return await list_available_openai_compatible_models(url, api_key)
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
