from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.routes import auth, printer, job, material
from app.dependencies import close_redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_redis()


app = FastAPI(lifespan=lifespan)

# CORS middleware ДО включения роутеров
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Разрешаем фронтенд
    allow_credentials=True,  # Разрешаем credentials (cookies)
    allow_methods=["*"],  # Разрешаем все методы (GET, POST, etc.)
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Подключение маршрутов
app.include_router(job.router)
app.include_router(material.router)
app.include_router(printer.router)
app.include_router(auth.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
