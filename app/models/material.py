from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.asyncio import AsyncSession
from database import Base
from sqlalchemy.orm import relationship

class Material(Base):  # Описывает материал для печати
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    quantity_storage = Column(Float, nullable=False)  # Количество на складе

    jobs = relationship("Job", back_populates="material")  # Добавлено для связи с Job