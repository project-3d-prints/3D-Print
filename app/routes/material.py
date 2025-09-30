from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.material import Material
from schemas.material import MaterialCreate, MaterialOut, MaterialUpdate
from typing import List, Annotated
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/materials", tags=["materials"])

# Добавляет материал
@router.post("/", response_model=MaterialOut)
async def add_material(
    material: MaterialCreate,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> MaterialOut:
    db_material = Material(**material.dict())
    db.add(db_material)
    await db.commit()
    await db.refresh(db_material)
    logger.info(f"Material {db_material.id} created successfully")
    return db_material

# Возвращает список материалов
@router.get("/", response_model=List[MaterialOut])
async def list_materials(
    db: Annotated[AsyncSession, Depends(get_db)]
) -> List[MaterialOut]:
    result = await db.execute(select(Material))
    materials = result.scalars().all()
    logger.info(f"Fetched {len(materials)} materials")
    return materials

# Возвращает конкретный материал
@router.get("/{material_id}", response_model=MaterialOut)
async def get_material(
    material_id: int,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> MaterialOut:
    result = await db.execute(select(Material).where(Material.id == material_id))
    material = result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    logger.info(f"Fetched material {material_id}")
    return material

# Обновляет материал
@router.patch("/{material_id}", response_model=MaterialOut)
async def update_material(
    material_id: int,
    data: MaterialUpdate,
    db: Annotated[AsyncSession, Depends(get_db)]
) -> MaterialOut:
    try:
        result = await db.execute(select(Material).where(Material.id == material_id))
        material = result.scalar_one_or_none()
        if not material:
            raise HTTPException(status_code=404, detail="Material not found")
        for key, value in data.dict(exclude_unset=True).items():
            if value is not None:
                setattr(material, key, value)
        db.add(material)
        await db.commit()
        await db.refresh(material)
        logger.info(f"Material {material_id} updated successfully")
        return material
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error updating material {material_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")