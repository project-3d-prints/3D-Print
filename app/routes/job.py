from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from collections import defaultdict
from database import get_db
from models.job import Job
from models.user import User
from models.material import Material  # Импорт модели Material
from schemas.job import JobCreate, JobOut
from dependencies import get_current_user
from typing import List, Annotated
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from fastapi import Query
from utils.sort_jobs import sort_jobs
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/", response_model=JobOut)
async def create_job(
    job: JobCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)]
) -> JobOut:
    priority_dct = {"глава лаборатории": 1, "учитель": 2, "студент": 3}
    priority = priority_dct.get(current_user.role.value)

    WORKING_HOURS_PER_DAY = 13  

    result = await db.execute(
        select(Job).where(Job.printer_id == job.printer_id)
    )
    all_jobs = result.scalars().all()

    jobs_by_date = defaultdict(list)
    for j in all_jobs:
        jobs_by_date[j.deadline].append(j)
    logger.info(f"Jobs by date initialized: {dict(jobs_by_date)}")

    today = date.today()
    logger.info(f"Current date (today): {today}, type: {type(today)}")
    max_search_days = 30 

    # Проверяем дедлайн с детальной отладкой
    selected_day = None
    try:
        logger.info(f"Received deadline: {job.deadline}, type: {type(job.deadline)}")
        user_deadline = job.deadline if isinstance(job.deadline, date) else date.fromisoformat(job.deadline.strip())
        logger.info(f"Processed user_deadline: {user_deadline}, type: {type(user_deadline)}")
        logger.info(f"Comparing: user_deadline ({user_deadline}) > today ({today})")
        if user_deadline > today:
            existing_jobs = jobs_by_date.get(user_deadline, [])
            logger.info(f"Existing jobs on {user_deadline}: {[(j.id, j.duration) for j in existing_jobs]}")
            total_duration = sum(j.duration for j in existing_jobs)
            logger.info(f"Total duration on {user_deadline}: {total_duration}, new duration: {job.duration}, limit: {WORKING_HOURS_PER_DAY}")
            if total_duration + job.duration <= WORKING_HOURS_PER_DAY:
                selected_day = user_deadline
                logger.info(f"Selected day set to user_deadline: {selected_day}")
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Недостаточно времени на {user_deadline} для принтера {job.printer_id} (свободно {WORKING_HOURS_PER_DAY - total_duration} часов)"
                )
        else:
            logger.error(f"Deadline validation failed: user_deadline {user_deadline} <= today {today}")
            raise HTTPException(status_code=400, detail=f"Дедлайн {user_deadline} должен быть в будущем")
    except ValueError as e:
        logger.error(f"ValueError in deadline parsing: {e}, deadline: {job.deadline}")
        raise HTTPException(status_code=400, detail="Неверный формат дедлайна. Используйте YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Unexpected error during deadline validation: {e}")
        raise HTTPException(status_code=400, detail=f"Ошибка обработки дедлайна: {str(e)}")

    # Fallback на следующий доступный день только если selected_day не установлен
    if not selected_day:
        logger.info("No valid user_deadline, searching for next available day")
        for offset in range(max_search_days):
            candidate_day = today + timedelta(days=offset)
            existing_jobs = jobs_by_date.get(candidate_day, [])
            total_duration = sum(j.duration for j in existing_jobs)
            logger.info(f"Checking day {candidate_day}: total_duration {total_duration}, new duration {job.duration}")
            if total_duration + job.duration <= WORKING_HOURS_PER_DAY:
                selected_day = candidate_day
                logger.info(f"Selected next available day: {selected_day}")
                break

    if not selected_day:
        raise HTTPException(
            status_code=400,
            detail="Нет свободного дня в ближайшие 30 дней для размещения заявки"
        )

    # Проверка наличия материала с приведением типа
    material_id = int(job.material_id)  # Приводим material_id к int
    logger.info(f"Checking material with ID: {material_id}, type: {type(material_id)}")
    material_result = await db.execute(select(Material).where(Material.id == material_id))
    material = material_result.scalar_one_or_none()
    if not material:
        raise HTTPException(status_code=400, detail=f"Материал с ID {material_id} не найден")

    db_job = Job(
        user_id=current_user.id,
        printer_id=job.printer_id,
        material_id=material_id,  # Сохраняем ID материала
        duration=job.duration,
        deadline=selected_day,
        created_at=datetime.utcnow().date(),
        material_amount=job.material_amount,
        priority=priority
    )

    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)

    # Заполняем JobOut с правильным материалом
    job_out = JobOut(
        id=db_job.id,
        user_id=db_job.user_id,
        printer_id=db_job.printer_id,
        duration=db_job.duration,
        deadline=db_job.deadline.isoformat(),  # Преобразуем date в строку
        created_at=db_job.created_at.isoformat(),  # Преобразуем date в строку
        material_amount=db_job.material_amount,
        priority=db_job.priority,
        user=current_user.username,
        date=db_job.deadline.isoformat() if db_job.deadline else None,  # Преобразуем date в строку или None
        material=material.name if material else "Не указан"  # Используем имя материала
    )

    return job_out

@router.get("/queue/{printer_id}", response_model=List[JobOut], summary="Получить график заявок для принтера")
async def get_queue(
    printer_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    day: Optional[date] = Query(None, description="Фильтр по дате (YYYY-MM-DD)")
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
                'jobs': [],
                'total_material': 0,
                'total_duration': 0
            }
        jobs_by_date[deadline_date]['jobs'].append(job)
        jobs_by_date[deadline_date]['total_material'] += job.material_amount
        jobs_by_date[deadline_date]['total_duration'] += job.duration

    for deadline_date, data in jobs_by_date.items():
        total_duration = data['total_duration']
        if total_duration > WORKING_HOURS_PER_DAY:
            raise HTTPException(
                status_code=400,
                detail=f"Суммарное время заявок ({total_duration} часов) на {deadline_date} для принтера {printer_id} превышает рабочий день ({WORKING_HOURS_PER_DAY} часов)"
            )

    # Создаём объекты JobOut с заполненными полями
    job_outs = []
    for job in sorted_jobs:
        user_result = await db.execute(select(User).where(User.id == job.user_id))
        user = user_result.scalar_one_or_none()
        material_result = await db.execute(select(Material).where(Material.id == job.material_id))
        material = material_result.scalar_one_or_none()
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
            date=job.deadline.isoformat() if job.deadline else None,  # Преобразуем date в строку или None
            material=material.name if material else "Не указан"  # Используем имя материала
        )
        job_outs.append(job_out)

    return job_outs