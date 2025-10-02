from pydantic import BaseModel
from app.enums import PrinterType  # общий Enum


class PrinterBase(BaseModel):
    name: str
    type: PrinterType
    quantity_material: int


class PrinterCreate(PrinterBase):
    """Формат для создания нового принтера"""

    class Config:
        schema_extra = {
            "example": {
                "name": "printer_1",
                "type": "plastic",
                "quantity_material": "Измеряется в гр или мл",
            }
        }


class PrinterOut(PrinterBase):
    """Формат ответа при возврате информации о принтере"""

    id: int
    user_id: int
    username: str
    type: PrinterType
    quantity_material: int

    class Config:
        from_attributes = True


class UpdatePrinterQuantity(BaseModel):
    printer_id: int
    quantity_printer: float
