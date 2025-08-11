from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.job import Job
from models.user import User
from schemas.job import JobCreate, JobOut
from dependencies import get_current_user
from typing import List, Annotated
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from fastapi import Query

router = APIRouter(prefix="/jobs", tags=["jobs"])
#Создает задание. Автоматически выбирает ближайший свободный день (в пределах 30 дней), если суммарная длительность заданий не превышает 13 часов.
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

    from collections import defaultdict
    from datetime import timedelta

    jobs_by_date = defaultdict(list)
    for j in all_jobs:
        jobs_by_date[j.deadline].append(j)


    today = datetime.now(timezone.utc).date()
    max_search_days = 30 

    selected_day = None
    for offset in range(max_search_days):
        candidate_day = today + timedelta(days=offset)

        total_duration = sum(j.duration for j in jobs_by_date[candidate_day])

        if total_duration + job.duration <= WORKING_HOURS_PER_DAY:
            selected_day = candidate_day
            break

    if not selected_day:
        raise HTTPException(
            status_code=400,
            detail="Нет свободного дня в ближайшие 30 дней для размещения заявки"
        )

    db_job = Job(
        user_id=current_user.id,
        printer_id=job.printer_id,
        duration=job.duration,
        deadline=selected_day,
        created_at=datetime.utcnow(),
        material_amount=job.material_amount,
        priority=priority
    )

    db.add(db_job)
    await db.commit()
    await db.refresh(db_job)

    return db_job
    

#Возвращает список заданий для принтера, отсортированный по дедлайну и приоритету. Поддерживает фильтр по дате (?day=YYYY-MM-DD).
@router.get("/queue/{printer_id}", response_model=List[JobOut], summary="Получить график заявок для принтера")
async def get_queue(
    printer_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    day: Optional[date] = Query(None, description="Фильтр по дате (YYYY-MM-DD)")
) -> List[JobOut]:

    WORKING_HOURS_START = 8
    WORKING_HOURS_END = 21
    WORKING_HOURS_PER_DAY = WORKING_HOURS_END - WORKING_HOURS_START

    query = select(Job).where(Job.printer_id == printer_id)

    if day:
        query = query.where(Job.deadline == day)

    query = query.order_by(Job.deadline, Job.priority)

    result = await db.execute(query)
    jobs = result.scalars().all()

    if not jobs:
        return []

    jobs_by_date = {}
    for job in jobs:
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

    sorted_jobs = []
    for deadline_date in sorted(jobs_by_date.keys()):
        sorted_jobs.extend(jobs_by_date[deadline_date]['jobs'])

    return sorted_jobs

#Для создания задания отправляй POST с JSON {printer_id, duration, deadline, material_amount}.
#Для отображения очереди используй GET /jobs/queue/{printer_id}.