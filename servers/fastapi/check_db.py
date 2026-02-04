import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
import json

DATABASE_URL = "sqlite+aiosqlite:///E:/presenton/app_data/presenton.db"

async def check_db():
    engine = create_async_engine(DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    async with async_session() as session:
        # Get latest presentation
        result = await session.execute(text("SELECT id, title, outlines, structure FROM presentations ORDER BY created_at DESC LIMIT 1"))
        presentation = result.first()
        
        if presentation:
            print(f"\nLatest Presentation ID: {presentation.id}")
            print(f"Title: {presentation.title}")
            # print(f"Outlines: {presentation.outlines}")
            
            # Get slides
            result = await session.execute(text(f"SELECT id, \"index\", layout, content FROM slides WHERE presentation = '{presentation.id}' ORDER BY \"index\" ASC"))
            slides = result.all()
            print(f"\nSlides found: {len(slides)}")
            
            for slide in slides:
                print(f"\nSlide {slide.index} Layout: {slide.layout}")
                try:
                    content = json.loads(slide.content)
                    print(json.dumps(content, indent=2, ensure_ascii=False))
                except:
                    print(f"Raw content: {slide.content}")
        else:
            print("No presentations found.")

if __name__ == "__main__":
    asyncio.run(check_db())
