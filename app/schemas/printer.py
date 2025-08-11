from pydantic import BaseModel

class PrinterBase(BaseModel):
    name: str

class PrinterCreate(PrinterBase):#Формат для создания принтера.

    class Config:
        schema_extra = {
            "example": {
                "name": "printer_1"
            }
        }

class PrinterOut(PrinterBase):#Формат ответа.
    name: str
    id: int
    user_id: int
    username: str

    class Config:
        from_attributes = True
#Используй для формы создания принтера и отображения списка.