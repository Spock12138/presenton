from pptx.enum.text import PP_ALIGN
from pydantic import BaseModel, ValidationError
from typing import Optional

class TestModel(BaseModel):
    alignment: Optional[PP_ALIGN] = None

try:
    print(f"Validating 1 (LEFT)...")
    m = TestModel(alignment=1)
    print(f"Success: {m}")
except ValidationError as e:
    print(f"Failed: {e}")

try:
    print(f"Validating PP_ALIGN.LEFT...")
    m = TestModel(alignment=PP_ALIGN.LEFT)
    print(f"Success: {m}")
except ValidationError as e:
    print(f"Failed: {e}")
