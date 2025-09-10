# schemas/job.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

class JobCreate(BaseModel):
    printer_id: int
    duration: float
    deadline: str  # Строковый формат даты (например, "2025-09-14")
    material_amount: float
    material_id: str  # Строковый ID материала (например, "11")

    class Config:
        from_attributes = True

class JobOut(BaseModel):
    id: int
    user_id: int
    printer_id: int
    duration: float
    deadline: str  # Строка в формате ISO (например, "2025-09-14")
    created_at: str  # Строка в формате ISO
    material_amount: float
    priority: int
    user: str
    date: Optional[str] = None  # Необязательное поле, строка или None
    material: str  # Имя материала, например "ABS"

    class Config:
        from_attributes = True