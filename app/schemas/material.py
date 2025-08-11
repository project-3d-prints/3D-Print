from pydantic import BaseModel, Field

class MaterialCreate(BaseModel):#Формат для создания материала.
    name: str = Field(..., example="PLA")
    printer_id: int 
    quantity: float = Field(..., gt=0, example=5.0)  

class MaterialOut(MaterialCreate):#Формат ответа.
    id: int

    class Config:
        orm_mode = True

class MaterialUpdate(BaseModel):#Формат для обновления количества.
    quantity: float = Field(..., gt=0, example=10.0)
#Используй для форм добавления/обновления материалов.