"""
Template Request Upload API

礼宾式 MVP：用户上传 PPTX 文件作为模板收录请求，
管理员稍后在服务器上进行人工审核和处理。
"""

import os
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

from utils.get_env import get_app_data_directory_env


TEMPLATE_REQUESTS_ROUTER = APIRouter(prefix="/templates", tags=["Templates"])


# 允许的文件类型
ALLOWED_CONTENT_TYPES = [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",  # .pptx
]

# 最大文件大小 (50MB)
MAX_FILE_SIZE_MB = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


class TemplateRequestResponse(BaseModel):
    """模板请求上传响应"""
    success: bool
    message: str
    filename: str


def get_template_requests_directory() -> str:
    """获取模板请求存储目录"""
    app_data_dir = get_app_data_directory_env() or "./app_data"
    requests_dir = os.path.join(app_data_dir, "template_requests")
    os.makedirs(requests_dir, exist_ok=True)
    return requests_dir


def generate_timestamped_filename(original_filename: str) -> str:
    """
    生成带时间戳的文件名以避免冲突
    格式：YYYYMMDD_HHMM_original_name.pptx
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    # 清理原始文件名（移除路径，保留文件名）
    safe_original = os.path.basename(original_filename)
    # 移除可能的不安全字符
    safe_original = "".join(c for c in safe_original if c.isalnum() or c in "._- ")
    return f"{timestamp}_{safe_original}"


@TEMPLATE_REQUESTS_ROUTER.post("/request-upload", response_model=TemplateRequestResponse)
async def request_template_upload(
    file: UploadFile = File(..., description="PPTX template file to upload")
):
    """
    上传 PPTX 模板收录请求
    
    用户上传 PPTX 文件，我们将其存储在服务器上以供管理员稍后进行人工审核。
    
    限制:
    - 仅接受 .pptx 文件
    - 最大文件大小: 50MB
    """
    
    # 验证文件扩展名
    if not file.filename or not file.filename.lower().endswith(".pptx"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only .pptx files are accepted."
        )
    
    # 验证 Content-Type
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid content type. Only PPTX files are accepted. Received: {file.content_type}"
        )
    
    # 读取文件内容
    content = await file.read()
    
    # 验证文件大小
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE_MB}MB."
        )
    
    # 验证文件不为空
    if len(content) == 0:
        raise HTTPException(
            status_code=400,
            detail="File is empty."
        )
    
    # 生成带时间戳的文件名
    timestamped_filename = generate_timestamped_filename(file.filename)
    
    # 获取存储目录并保存文件
    requests_dir = get_template_requests_directory()
    file_path = os.path.join(requests_dir, timestamped_filename)
    
    try:
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )
    
    return TemplateRequestResponse(
        success=True,
        message="Upload successful. We are processing your template.",
        filename=timestamped_filename
    )
