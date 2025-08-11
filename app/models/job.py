from sqlalchemy import Column, Integer, ForeignKey, Float, Date
from sqlalchemy.ext.asyncio import AsyncSession
from database import Base
from sqlalchemy.orm import relationship

class Job(Base):#Модель Job описывает задание на печать
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    printer_id = Column(Integer, ForeignKey("printers.id"), nullable=False)
    duration = Column(Float, nullable=False) #длительность печати 
    deadline = Column(Date, nullable=True)#дата дедлайна
    created_at = Column(Date, nullable=False)  
    material_amount = Column(Float, nullable=False) #количество материала
    priority = Column(Integer, nullable=False) #Приоритет (1=высокий для главы лаборатории, 2=учитель, 3=студент).
    

    user = relationship("User", back_populates="jobs")
    printer = relationship("Printer", back_populates="jobs")

#JSON-ответы для /jobs будут содержать эти поля.