from typing import Optional
from sqlmodel import Field, SQLModel

class UniversityModel(SQLModel, table=True):
    __tablename__ = "universities"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    code: Optional[str] = Field(default=None, index=True)
    department: Optional[str] = Field(default=None) # 主管部门
    location: Optional[str] = Field(default=None) # 所在地
    level: Optional[str] = Field(default=None) # 办学层次
    category: Optional[str] = Field(default=None) # 备注
    logo_url: Optional[str] = Field(default=None)
    alias: Optional[str] = Field(default=None) # e.g. zju, pku for template matching
