import aiohttp
import asyncio
import json

async def check_api():
    url = "http://localhost:3000/api/template?group=school_zjut_opening"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                print(f"Status: {response.status}")
                if response.status == 200:
                    data = await response.json()
                    print(json.dumps(data, indent=2, ensure_ascii=False))
                else:
                    text = await response.text()
                    print(f"Error: {text}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(check_api())
