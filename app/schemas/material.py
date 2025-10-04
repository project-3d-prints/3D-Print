from pydantic import BaseModel, Field

class MaterialCreate(BaseModel):  # Формат для создания материала
    name: str = Field(..., example="PLA")
    quantity_storage: float = Field(..., gt=0, example=10.0)

class MaterialOut(MaterialCreate):  # Формат ответа
    id: int

    class Config:
        orm_mode = True

class MaterialUpdate(BaseModel):  # Формат для обновления количества на складе
    name: str | None = Field(None, example="PLA Updated")
    quantity_storage: float | None = Field(None, ge=0, example=15.0)

# Используй для форм добавления/обновления материалов