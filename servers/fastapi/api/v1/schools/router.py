from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from services.database import get_async_session
from models.sql.university import UniversityModel
from typing import List, Optional

API_V1_SCHOOLS_ROUTER = APIRouter(prefix="/api/v1/schools", tags=["schools"])

@API_V1_SCHOOLS_ROUTER.get("/search", response_model=List[UniversityModel])
async def search_universities(
    q: str = Query(..., min_length=1),
    limit: int = 20,
    db: AsyncSession = Depends(get_async_session)
):
    # Case-insensitive search
    stmt = select(UniversityModel).where(UniversityModel.name.like(f"%{q}%")).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@API_V1_SCHOOLS_ROUTER.get("/", response_model=List[UniversityModel])
async def list_universities(
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_async_session)
):
    stmt = select(UniversityModel).offset(offset).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()
