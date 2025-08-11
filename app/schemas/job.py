from pydantic import BaseModel, Field
from datetime import date

class JobCreate(BaseModel):#Формат входных данных для создания задания.
    printer_id: int
    duration: int
    deadline: date  
    material_amount: int

    class Config:
        schema_extra = {
            "example": {
                "printer_id": 0,
                "duration": 0,
                "deadline": "2025-06-18T14:25:00",
                "material_amount": 0
            }
        }
        
class JobOut(JobCreate):#Формат ответа, включает дополнительные поля (id, user_id, created_at).
    id: int
    user_id: int
    created_at: date

    class Config:
        orm_mode = True
#Отправляй JSON в формате JobCreate для POST /jobs.
#Обрабатывай ответы в формате JobOut.