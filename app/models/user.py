import enum
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import Base
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum


class UserRole(enum.Enum):
    student = "студент"
    teacher = "учитель"
    lab_head = "глава лаборатории"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, unique=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hash_pass = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    jobs = relationship("Job", back_populates="user")


# Роль определяет приоритет заданий и доступ (например, только lab_head может создавать принтеры)
