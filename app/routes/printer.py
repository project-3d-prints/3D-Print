from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.printer import Printer
from app.models.user import UserRole, User
from app.schemas.printer import PrinterCreate, PrinterOut, UpdatePrinterQuantity
from app.dependencies import get_current_user
from typing import List

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
            detail="Только Глава лаборатории может добавлять принтер",
        )

    existing = await db.execute(select(Printer).where(Printer.name == printer.name))
    if existing.scalar():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Такое имя занято"
        )
    db_printer = Printer(
        name=printer.name,
        user_id=current_user.id,
        username=current_user.username,
        type=printer.type,
        quantity_material=printer.quantity_material,
    )
    db.add(db_printer)
    await db.commit()
    await db.refresh(db_printer)
    return db_printer


# Возвращает список принтеров.
@router.get("/", response_model=List[PrinterOut])
async def get_printers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Printer))
    printers = result.scalars().all()
    return printers


# Используй GET для отображения списка принтеров в <select>.
# POST для формы создания принтера (только для главы лаборатории).


@router.patch("/", response_model=List[PrinterOut])
async def update_printer_quantity(
    data: UpdatePrinterQuantity, db: Annotated[AsyncSession, Depends(get_db)]
) -> List[PrinterOut]:

    result = await db.execute(select(Printer).where(Printer.id == data.printer_id))
    printer = result.scalar_one_or_none()

    if not printer:
        raise HTTPException(
            status_code=404, detail=f"Принтер с ID {data.printer_id} не найден"
        )

    printer.quantity_material = data.quantity_printer

    db.add(printer)
    await db.commit()
    await db.refresh(printer)

    result = await db.execute(select(Printer))
    printers = result.scalars().all()

    return printers
