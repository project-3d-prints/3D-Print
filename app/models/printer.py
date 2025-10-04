from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SqlEnum
from app.database import Base
from sqlalchemy.orm import relationship
from app.enums import PrinterType


class Printer(Base):
    """
    SQLAlchemy-модель для таблицы printers.
    Описывает 3D-принтер и его свойства.
    """

    __tablename__ = "printers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    username = Column(String, nullable=False)

    type = Column(
        SqlEnum(PrinterType),
        nullable=False,
        comment="Тип материала для печати (plastic/resin)",
    )

    quantity_material = Column(Integer, nullable=False)

    jobs = relationship("Job", back_populates="printer")
