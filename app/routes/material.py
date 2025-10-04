from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.material import Material
from app.models.user import UserRole, User
from app.schemas.material import MaterialCreate, MaterialOut, MaterialUpdate
from app.dependencies import get_current_user
from typing import List, Annotated
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/materials", tags=["materials"])

# Добавляет материал (только lab_head)
@router.post("/", response_model=MaterialOut)
async def add_material(
    material: MaterialCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> MaterialOut:
    if current_user.role != UserRole.lab_head:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только Глава лаборатории может добавлять материал"
        )

    logger.info(f"Checking for existing material with name: {material.name}")
    existing = await db.execute(select(Material).where(Material.name == material.name))
    if existing.scalar():
        logger.error(f"Material with name {material.name} already exists")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Материал с таким названием уже есть"
        )

    db_material = Material(**material.dict())
    db.add(db_material)
    await db.commit()
    await db.refresh(db_material)
    logger.info(f"Material {db_material.id} created successfully")
    return MaterialOut(
        id=db_material.id,
        name=db_material.name,
        quantity_storage=db_material.quantity_storage
    )

# Возвращает список материалов
@router.get("/", response_model=List[MaterialOut])
async def list_materials(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> List[MaterialOut]:
    try:
        logger.info("Fetching all materials")
        result = await db.execute(select(Material).order_by(Material.id))
        materials = result.scalars().all()
        logger.info(f"Fetched {len(materials)} materials")
        return [
            MaterialOut(
                id=material.id,
                name=material.name,
                quantity_storage=material.quantity_storage
            )
            for material in materials
        ]
    except Exception as e:
        logger.error(f"Error fetching materials: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")

# Возвращает конкретный материал
@router.get("/{material_id}", response_model=MaterialOut)
async def get_material(
    material_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> MaterialOut:
    result = await db.execute(select(Material).where(Material.id == material_id))
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="Материал не найден")
    logger.info(f"Fetched material {material_id}")
    return MaterialOut(
        id=material.id,
        name=material.name,
        quantity_storage=material.quantity_storage
    )

# Обновляет материал
@router.patch("/{material_id}", response_model=MaterialOut)
async def update_material(
    material_id: int,
    data: MaterialUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> MaterialOut:
    try:
        result = await db.execute(select(Material).where(Material.id == material_id))
        material = result.scalar_one_or_none()
        if not material:
            raise HTTPException(status_code=404, detail="Материал не найден")
        if current_user.role != UserRole.lab_head:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Только Глава лаборатории может редактировать материалы"
            )

        # Проверяем изменения только если они предоставлены
        updated = False
        if data.quantity_storage is not None:
            if data.quantity_storage <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Количество материала не может быть отрицательным или нулевым"
                )
            material.quantity_storage = data.quantity_storage
            updated = True
        if data.name is not None:
            existing = await db.execute(select(Material).where(Material.name == data.name, Material.id != material_id))
            if existing.scalar():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Материал с таким названием уже есть"
                )
            material.name = data.name
            updated = True

        # Если ничего не обновлено, возвращаем текущий материал
        if not updated:
            logger.info(f"No changes provided for material {material_id}")
            return MaterialOut(
                id=material.id,
                name=material.name,
                quantity_storage=material.quantity_storage
            )

        db.add(material)
        await db.commit()
        await db.refresh(material)
        logger.info(f"Material {material_id} updated successfully")
        return MaterialOut(
            id=material.id,
            name=material.name,
            quantity_storage=material.quantity_storage
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error updating material {material_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")