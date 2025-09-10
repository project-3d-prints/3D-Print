from typing import List  # Добавляем импорт
from schemas.job import JobOut
from schemas.user import UserOut
from datetime import datetime

# Сортирует задания по приоритету роли, дедлайну и времени создания
role_priority = {
    "глава лаборатории": 0,
    "учитель": 1,
    "студент": 2,
}

def sort_jobs(jobs: List[JobOut], users: dict) -> List[JobOut]:
    """
    Сортирует заявки по приоритету роли и времени создания.
    Если дедлайн нужен, можно раскомментировать строку с deadline.
    users: словарь с ID пользователя и его ролью, например {1: "глава лаборатории", 2: "студент"}
    """
    sorted_jobs = sorted(jobs, key=lambda x: (
        role_priority[users.get(x.user_id, "студент")],
        x.deadline if x.deadline else datetime.max,   # Дедлайн (раскомментировать, если нужен)
        x.created_at                                     # Время создания
    ))
    return sorted_jobs