from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.asyncio import AsyncSession
from database import Base
from sqlalchemy.orm import relationship

class Material(Base):  # Описывает материал для печати
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    printer_id = Column(Integer, ForeignKey("printers.id"), nullable=False)
    quantity_printer = Column(Float, nullable=False)  # Количество в принтере
    quantity_storage = Column(Float, nullable=False)  # Количество на складе

    printer = relationship("Printer", back_populates="materials")
    jobs = relationship("Job", back_populates="material") 