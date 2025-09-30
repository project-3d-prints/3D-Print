from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.printer import Printer
from models.user import UserRole, User
from schemas.printer import PrinterCreate, PrinterOut, UpdatePrinterQuantity
from dependencies import get_current_user
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/printers", tags=["printers"])

# Создает принтер (только lab_head).
@router.post("/", response_model=PrinterOut)
async def create_printer(
    printer: PrinterCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
) -> PrinterOut:
    if current_user.role != UserRole.lab_head:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только Глава лаборатории может добавлять принтер"
        )
        
    existing = await db.execute(select(Printer).where(Printer.name == printer.name))
    if existing.scalar():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Такое имя занято"
        )
    db_printer = Printer(
        name=printer.name,
        user_id=current_user.id,  
        username=current_user.username,
        type=printer.type,
        quantity_material=printer.quantity_material
    )
    db.add(db_printer)
    await db.commit()
    await db.refresh(db_printer)
    logger.info(f"Printer {db_printer.id} created by user {current_user.id}")
    return db_printer

# Возвращает список принтеров.
@router.get("/", response_model=List[PrinterOut])
async def get_printers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Printer))
    printers = result.scalars().all()
    for printer in printers:
        printer.warning = (
            "Критически низкий уровень материала"
            if printer.quantity_material < 10
            else None
        )
    logger.info(f"Fetched {len(printers)} printers")
    return printers

# Возвращает конкретный принтер.
@router.get("/{printer_id}", response_model=PrinterOut)
async def get_printer(printer_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Printer).where(Printer.id == printer_id))
        printer = result.scalar_one_or_none()
        if not printer:
            raise HTTPException(status_code=404, detail="Printer not found")
        printer.warning = (
            "Критически низкий уровень материала"
            if printer.quantity_material < 10
            else None
        )
        logger.info(f"Fetched printer {printer_id}")
        return printer
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error fetching printer {printer_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

# Обновляет количество материала в принтере.
@router.patch("/", response_model=List[PrinterOut])
async def update_printer_quantity(
    data: UpdatePrinterQuantity,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> List[PrinterOut]:
    try:
        result = await db.execute(select(Printer).where(Printer.id == data.printer_id))
        printer = result.scalar_one_or_none()
        if not printer:
            raise HTTPException(status_code=404, detail=f"Принтер с ID {data.printer_id} не найден")

        printer.quantity_material = data.quantity_printer
        db.add(printer)
        await db.commit()
        await db.refresh(printer)
        logger.info(f"Printer {data.printer_id} quantity updated to {data.quantity_printer}")

        result = await db.execute(select(Printer))
        printers = result.scalars().all()
        for printer in printers:
            printer.warning = (
                "Критически низкий уровень материала"
                if printer.quantity_material < 10
                else None
            )
        return printers
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error updating printer {data.printer_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")