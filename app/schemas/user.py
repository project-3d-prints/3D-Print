from pydantic import BaseModel
from models.user import UserRole


class UserBase(BaseModel):
    username: str
    role: UserRole

class UserCreate(UserBase):#Формат для регистрации.
    password: str

class UserOut(UserBase):#Формат ответа.
    id: int
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):#Формат для логина.
    username: str
    password: str

#Используй для форм регистрации и логина.