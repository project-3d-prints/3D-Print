from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from collections import defaultdict
from app.database import get_db
from app.models.job import Job
from app.models.user import User
from app.models.material import Material
from app.schemas.job import JobCreate, JobOut
from app.dependencies import get_current_user
from typing import List, Annotated
from app.models.printer import Printer
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from fastapi import Query
from app.utils.sort_jobs import sort_jobs
import logging
from app.utils.validate_file_minio import validate_file_minio
from app.utils.minio import minio_client
import json
from pydantic import ValidationError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/", response_model=JobOut)
async def create_job(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    printer_id: int = Form(...),
    duration: float = Form(...),
    deadline: str = Form(...),
    material_amount: float = Form(...),
    material_id: int = Form(...),  # Добавлено: принимаем material_id из формы
    file: Optional[UploadFile] = File(None),
) -> JobOut:

    if file:
        await validate_file_minio(file)

    priority_dct = {"глава лаборатории": 1, "учитель": 2, "студент": 3}
    priority = priority_dct.get(current_user.role.value)
    if priority is None:
        raise HTTPException(status_code=400, detail="Недопустимая роль пользователя")

    WORKING_HOURS_PER_DAY = 13

    printer_result = await db.execute(select(Printer).where(Printer.id == printer_id))
    printer = printer_result.scalar_one_or_none()
    if not printer:
        raise HTTPException(status_code=404, detail=f"Принтер {printer_id} не найден")

    # Проверяем материал
    material_result = await db.execute(
        select(Material).where(Material.id == material_id)
    )
    material = material_result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=404, detail=f"Материал {material_id} не найден")

    today = date.today()
    max_search_days = 30
    jobs_by_date = defaultdict(list)
    result = await db.execute(select(Job).where(Job.printer_id == printer_id))
    all_jobs = result.scalars().all()
    for j in all_jobs:
        jobs_by_date[j.deadline].append(j)

    selected_day = None
    try:
        user_deadline = (
            deadline
            if isinstance(deadline, date)
            else date.fromisoformat(deadline.strip())
        )
        if user_deadline > today:
            total_duration = sum(
                j.duration for j in jobs_by_date.get(user_deadline, [])
            )
            if total_duration + duration <= WORKING_HOURS_PER_DAY:
                selected_day = user_deadline
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Недостаточно времени на {user_deadline} для принтера {printer_id}",
                )
        else:
            raise HTTPException(
                status_code=400, detail=f"Дедлайн {user_deadline} должен быть в будущем"
            )
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Неверный формат дедлайна (YYYY-MM-DD)"
        )

    if not selected_day:
        for offset in range(max_search_days):
            candidate_day = today + timedelta(days=offset)
            total_duration = sum(
                j.duration for j in jobs_by_date.get(candidate_day, [])
            )
            if total_duration + duration <= WORKING_HOURS_PER_DAY:
                selected_day = candidate_day
                break
    if not selected_day:
        raise HTTPException(
            status_code=400, detail="Нет свободного дня в ближайшие 30 дней"
        )

    if printer.quantity_material < material_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Недостаточно материала в принтере {printer.name}. "
            f"Доступно: {printer.quantity_material}, требуется: {material_amount}",
        )
    printer.quantity_material -= material_amount
    db.add(printer)

    # Проверяем достаточно ли материала на складе
    if material.quantity_storage < material_amount:
        raise HTTPException(
            status_code=400,
            detail=f"Недостаточно материала на складе. "
            f"Доступно: {material.quantity_storage}, требуется: {material_amount}",
        )
    material.quantity_storage -= material_amount
    db.add(material)

    db_job = Job(
        user_id=current_user.id,
        printer_id=printer_id,
        duration=duration,
        deadline=selected_day,
        created_at=date.today(),
        material_amount=material_amount,
        priority=priority,
        material_id=material_id,  # Используем переданный material_id
    )
    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)

    file_path = None
    if file:
        try:
            file_path = await minio_client.upload_file(
                file=file,
                file_name=file.filename,
                user_id=current_user.id,
                job_id=db_job.id,
            )
            db_job.file_path = file_path
            db.add(db_job)
            await db.commit()
            await db.refresh(db_job)
        except Exception as err:
            raise HTTPException(
                status_code=500, detail=f"Ошибка загрузки файла: {str(err)}"
            )

    warning = None
    CRITICAL_LEVEL = 10
    if printer.quantity_material < CRITICAL_LEVEL:
        warning = f"Внимание: в принтере {printer.name} осталось мало материала ({printer.quantity_material})!"

    file_url = None
    if file_path:
        file_url = minio_client.get_temporary_url(file_path)

    job_out = JobOut(
        id=db_job.id,
        user_id=db_job.user_id,
        printer_id=db_job.printer_id,
        duration=db_job.duration,
        deadline=db_job.deadline.isoformat(),
        created_at=db_job.created_at.isoformat(),
        material_amount=db_job.material_amount,
        priority=db_job.priority,
        user=current_user.username,
        date=db_job.deadline.isoformat(),
        material=material.name,
        warning=warning,
        file_path=file_url,
    )

    if warning:
        job_out_dict = job_out.dict()
        job_out_dict["warning"] = warning
        return job_out_dict

    return job_out


@router.get(
    "/queue/{printer_id}",
    response_model=List[JobOut],
    summary="Получить график заявок для принтера",
)
async def get_queue(
    printer_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    day: Optional[date] = Query(None, description="Фильтр по дате (YYYY-MM-DD)"),
) -> List[JobOut]:

    WORKING_HOURS_START = 8
    WORKING_HOURS_END = 21
    WORKING_HOURS_PER_DAY = WORKING_HOURS_END - WORKING_HOURS_START

    query = select(Job)
    if printer_id != 0:  # Фильтр по printer_id только если не "все принтеры"
        query = query.where(Job.printer_id == printer_id)

    if day:
        query = query.where(Job.deadline == day)

    query = query.order_by(Job.deadline, Job.priority)

    result = await db.execute(query)
    jobs = result.scalars().all()

    if not jobs:
        return []

    # Получаем роли пользователей для сортировки
    user_ids = list(set(job.user_id for job in jobs))
    users_result = await db.execute(select(User).where(User.id.in_(user_ids)))
    users = users_result.scalars().all()
    users_dict = {user.id: user.role.value for user in users}

    # Сортировка
    sorted_jobs = sort_jobs(jobs, users_dict)

    # Проверка на превышение времени
    jobs_by_date = {}
    for job in sorted_jobs:
        deadline_date = job.deadline
        if deadline_date not in jobs_by_date:
            jobs_by_date[deadline_date] = {
                "jobs": [],
                "total_material": 0,
                "total_duration": 0,
            }
        jobs_by_date[deadline_date]["jobs"].append(job)
        jobs_by_date[deadline_date]["total_material"] += job.material_amount
        jobs_by_date[deadline_date]["total_duration"] += job.duration

    for deadline_date, data in jobs_by_date.items():
        total_duration = data["total_duration"]
        if total_duration > WORKING_HOURS_PER_DAY:
            raise HTTPException(
                status_code=400,
                detail=f"Суммарное время заявок ({total_duration} часов) на {deadline_date} для принтера {printer_id} превышает рабочий день ({WORKING_HOURS_PER_DAY} часов)",
            )

    # Создаём объекты JobOut с заполненными полями
    job_outs = []
    for job in sorted_jobs:
        user_result = await db.execute(select(User).where(User.id == job.user_id))
        user = user_result.scalar_one_or_none()
        material_result = await db.execute(
            select(Material).where(Material.id == job.material_id)
        )
        material = material_result.scalar_one_or_none()

        file_url = None
        if job.file_path:
            file_url = minio_client.get_temporary_url(job.file_path)

        job_out = JobOut(
            id=job.id,
            user_id=job.user_id,
            printer_id=job.printer_id,
            duration=job.duration,
            deadline=job.deadline.isoformat(),  # Преобразуем date в строку
            created_at=job.created_at.isoformat(),  # Преобразуем date в строку
            material_amount=job.material_amount,
            priority=job.priority,
            user=user.username if user else "Неизвестно",
            date=(
                job.deadline.isoformat() if job.deadline else None
            ),  # Преобразуем date в строку или None
            material=(
                material.name if material else "Не указан"
            ),  # Используем имя материала
            file_path=file_url,
        )
        job_outs.append(job_out)

    return job_outs


@router.get("/download/{job_id}")
async def get_download_url(
    job_id: int,
    db: Annotated[
        AsyncSession,
        Depends(get_db),
    ],
):
    job_result = await db.execute(select(Job).where(Job.id == job_id))
    job = job_result.scalar_one_or_none()

    if not job or not job.file_path:
        raise HTTPException(status_code=404, detail="Файл не найден")

    file_url = minio_client.get_temporary_url(job.file_path)
    file_url = file_url.replace("minio:9000", "localhost:9001")
    return {"download_url": file_url}
