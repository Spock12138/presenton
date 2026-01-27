import asyncio
import os
from openai import AsyncOpenAI

async def main():
    api_key = "sk-7cf455cf8bf944238eb2f01acb3f3a5a"
    base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    
    print(f"Testing connection to {base_url} with key {api_key[:5]}...")
    
    client = AsyncOpenAI(
        api_key=api_key,
        base_url=base_url
    )
    
    try:
        models = await client.models.list()
        print("Success! Models found:")
        for m in models.data:
            print(f" - {m.id}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())