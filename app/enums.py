from enum import Enum

class PrinterType(str, Enum):
    """
    Перечисление типа материалов для 3D-принтера.
    Используется и в БД, и в схемах для валидации.
    """
    plastic = "plastic"
    resin = "resin"
