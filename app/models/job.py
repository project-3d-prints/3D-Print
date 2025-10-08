from sqlalchemy import Column, Integer, ForeignKey, Float, Date, String
from app.database import Base
from sqlalchemy.orm import relationship


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    printer_id = Column(Integer, ForeignKey("printers.id"), nullable=False)
    duration = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    created_at = Column(Date, nullable=False)
    material_amount = Column(Float, nullable=False)
    priority = Column(Integer, nullable=False)
    file_path = Column(String, nullable=True)

    user = relationship("User", back_populates="jobs")
    printer = relationship("Printer", back_populates="jobs")
