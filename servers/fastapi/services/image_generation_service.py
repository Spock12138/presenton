import os
import aiohttp
import uuid
import base64
from typing import Union, Optional
from openai import AsyncOpenAI

from models.image_prompt import ImagePrompt
from models.sql.image_asset import ImageAsset
from utils.image_provider import (
    is_dalle3_selected,
    is_gemini_flash_selected,
    is_pixels_selected,
    is_pixabay_selected,

    is_gpt_image_1_5_selected,
    is_nanobanana_pro_selected,
    is_comfyui_selected
)
from utils.get_env import (
    get_pexels_api_key_env,
    get_pixabay_api_key_env,
    get_openai_api_key_env,
    get_google_api_key_env
)

class ImageGenerationService:
    def __init__(self, output_directory: str):
        self.output_directory = output_directory
        self.image_gen_func = self.get_image_gen_func()

    def get_image_gen_func(self):
        if is_dalle3_selected():
            return self.generate_image_openai
        elif is_gpt_image_1_5_selected():
             return self.generate_image_openai
        elif is_gemini_flash_selected():
            return self.generate_image_gemini
        elif is_pixels_selected():
            return self.get_image_from_pexels
        elif is_pixabay_selected():
            return self.get_image_from_pixabay
        else:
            return None

    async def generate_image_hybrid(self, prompt: str, output_directory: str) -> Union[str, ImageAsset]:
        # Fallback to Pexels directly
        return await self.get_image_from_pexels(prompt, output_directory)

    async def generate_image(self, image_prompt: ImagePrompt) -> Union[str, ImageAsset]:
        if self.image_gen_func:
            return await self.image_gen_func(image_prompt.prompt, self.output_directory)
        
        # Fallback or default
        return "/static/images/placeholder.jpg"

    async def get_image_from_pexels(self, prompt: str, output_directory: str) -> str:
        api_key = get_pexels_api_key_env()
        if not api_key:
            print("PEXELS_API_KEY not set")
            return "/static/images/placeholder.jpg"
            
        async with aiohttp.ClientSession() as session:
            headers = {"Authorization": api_key}
            url = f"https://api.pexels.com/v1/search?query={prompt}&per_page=1"
            try:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get("photos"):
                            return data["photos"][0]["src"]["large"]
            except Exception as e:
                print(f"Pexels error: {e}")
        return "/static/images/placeholder.jpg"

    async def get_image_from_pixabay(self, prompt: str, output_directory: str) -> str:
        api_key = get_pixabay_api_key_env()
        if not api_key:
            print("PIXABAY_API_KEY not set")
            return "/static/images/placeholder.jpg"

        url = f"https://pixabay.com/api/?key={api_key}&q={prompt}&image_type=photo"
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get("hits"):
                            return data["hits"][0]["largeImageURL"]
            except Exception as e:
                print(f"Pixabay error: {e}")
        return "/static/images/placeholder.jpg"

    async def generate_image_openai(self, prompt: str, output_directory: str) -> ImageAsset:
        api_key = get_openai_api_key_env()
        if not api_key:
            raise Exception("OPENAI_API_KEY not set")
            
        client = AsyncOpenAI(api_key=api_key)
        
        model = "dall-e-3" if is_dalle3_selected() else "dall-e-2" # Simplified logic
        
        try:
            response = await client.images.generate(
                model=model,
                prompt=prompt,
                n=1,
                size="1024x1024",
                response_format="b64_json",
            )
            
            image_data = base64.b64decode(response.data[0].b64_json)
            file_name = f"{uuid.uuid4()}.png"
            image_path = os.path.join(output_directory, file_name)
            
            with open(image_path, "wb") as f:
                f.write(image_data)
                
            return ImageAsset(path=image_path, extras={"prompt": prompt})
        except Exception as e:
            print(f"OpenAI generation error: {e}")
            return "/static/images/placeholder.jpg"

    async def generate_image_gemini(self, prompt: str, output_directory: str) -> ImageAsset:
         # Placeholder for Gemini implementation
         return "/static/images/placeholder.jpg"


