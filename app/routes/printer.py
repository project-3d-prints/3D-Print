from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.printer import Printer
from app.models.material import Material
from app.models.user import UserRole, User
from app.schemas.printer import PrinterCreate, PrinterOut, UpdatePrinterQuantity
from app.schemas.material import MaterialUpdate
from app.dependencies import get_current_user
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/printers", tags=["printers"])


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
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Принтер с таким названием уже есть",
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
    logger.info(f"Printer {db_printer.id} created by user {current_user.id}")
    return PrinterOut(
        id=db_printer.id,
        name=db_printer.name,
        type=db_printer.type,
        quantity_material=int(db_printer.quantity_material),
        user_id=db_printer.user_id,
        username=db_printer.username,
    )


@router.get("/", response_model=List[PrinterOut])
async def get_printers(
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Printer).order_by(Printer.id)
    )  # Добавлена сортировка по id
    printers = result.scalars().all()
    logger.info(f"Fetched {len(printers)} printers")
    return [
        PrinterOut(
            id=printer.id,
            name=printer.name,
            type=printer.type,
            quantity_material=int(printer.quantity_material),
            user_id=printer.user_id,
            username=printer.username,
        )
        for printer in printers
    ]


@router.get("/{printer_id}", response_model=PrinterOut)
async def get_printer(
    printer_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await db.execute(select(Printer).where(Printer.id == printer_id))
        printer = result.scalar_one_or_none()
        if not printer:
            raise HTTPException(status_code=404, detail="Принтер не найден")
        logger.info(f"Fetched printer {printer_id}")
        return PrinterOut(
            id=printer.id,
            name=printer.name,
            type=printer.type,
            quantity_material=int(printer.quantity_material),
            user_id=printer.user_id,
            username=printer.username,
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error fetching printer {printer_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")


@router.patch("/{printer_id}", response_model=PrinterOut)
async def update_printer_quantity(
    printer_id: int,
    updates: UpdatePrinterQuantity,
    current_user: Annotated[User, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db),
) -> PrinterOut:
    if current_user.role != UserRole.lab_head:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только Глава лаборатории может редактировать принтеры",
        )
    try:
        result = await db.execute(select(Printer).where(Printer.id == printer_id))
        printer = result.scalar_one_or_none()
        if not printer:
            raise HTTPException(status_code=404, detail="Принтер не найден")

        if updates.quantity_printer < 0:
            raise HTTPException(
                status_code=400,
                detail="Количество материала не может быть отрицательным",
            )

        material_result = await db.execute(
            select(Material).where(Material.type == printer.type)
        )
        material = material_result.scalar()
        if not material:
            raise HTTPException(status_code=404, detail="Материал не найден")
        if material.quantity_storage < updates.quantity_printer:
            raise HTTPException(
                status_code=400,
                detail="Недостаточно материала на складе",
            )

        material.quantity_storage -= updates.quantity_printer
        printer.quantity_material = updates.quantity_printer
        db.add(printer)
        await db.commit()
        await db.refresh(printer)

        logger.info(
            f"Printer {printer_id} quantity updated to {updates.quantity_printer}"
        )
        return PrinterOut(
            id=printer.id,
            name=printer.name,
            type=printer.type,
            quantity_material=int(printer.quantity_material),
            user_id=printer.user_id,
            username=printer.username,
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error updating printer {printer_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")
