
import asyncio
import aiohttp
import os
from dotenv import load_dotenv

load_dotenv(r"E:\presenton\.env")

async def test_pexels():
    api_key = os.getenv("PEXELS_API_KEY")
    print(f"API Key: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")
    
    if not api_key:
        print("No API Key found!")
        return

    headers = {"Authorization": api_key}
    url = "https://api.pexels.com/v1/search?query=nature&per_page=1"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            print(f"Status: {response.status}")
            if response.status == 200:
                data = await response.json()
                if data.get("photos"):
                    print(f"Image URL: {data['photos'][0]['src']['large']}")
                else:
                    print("No photos found.")
            else:
                print(f"Error: {await response.text()}")

if __name__ == "__main__":
    asyncio.run(test_pexels())
