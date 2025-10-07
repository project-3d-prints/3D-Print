from typing import Optional
from pydantic import BaseModel, Field
from app.enums import MaterialType


class MaterialBase(BaseModel):
    name: str = Field(..., example="PLA")
    quantity_storage: int = Field(..., gt=0, example=10.0)
    type: MaterialType


class MaterialCreate(MaterialBase):

    class Config:
        schema_extra = {
            "example": {
                "name": "printer_1",
                "quantity_storage": 1000,
                "type": "plastic or resin",
            }
        }


class MaterialOut(MaterialCreate):
    id: int
    warning: bool

    class Config:
        orm_mode = True


class MaterialUpdate(BaseModel):  # Формат для обновления количества на складе
    name: str | None = Field(None, example="PLA Updated")
    quantity_storage: float | None = Field(None, ge=0, example=15.0)
    type: MaterialType | None = None


# Используй для форм добавления/обновления материалов
