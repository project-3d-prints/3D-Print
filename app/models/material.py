from sqlalchemy import Column, Integer, String, Enum as SqlEnum
from app.database import Base
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
