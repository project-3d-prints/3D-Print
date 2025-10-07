from sqlalchemy import Column, Integer, String, Enum as SqlEnum
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import Base
from sqlalchemy.orm import relationship
from app.enums import MaterialType


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    type = Column(
        SqlEnum(MaterialType),
        nullable=False,
        comment="Тип материала (plastic/resin)",
    )
    quantity_storage = Column(Integer, nullable=False)

    jobs = relationship("Job", back_populates="material")
