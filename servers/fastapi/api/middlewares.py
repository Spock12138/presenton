import json
import os
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from models.user_config import UserConfig
from utils.get_env import get_can_change_keys_env, get_user_config_path_env
from utils.user_config import update_env_with_user_config


class UserConfigEnvUpdateMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if get_can_change_keys_env() != "false":
            user_config_path = get_user_config_path_env()
            if user_config_path and os.path.exists(user_config_path):
                try:
                    with open(user_config_path, "r", encoding="utf-8") as f:
                        config_data = json.load(f)
                    user_config = UserConfig(**config_data)
                    update_env_with_user_config(user_config)
                except Exception as e:
                    print(f"Error loading user config in middleware: {e}")
        return await call_next(request)
