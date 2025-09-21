from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routes import auth, printer, job, material
from dependencies import close_redis

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_redis()

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],  
    allow_credentials=True,  
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(job.router)
app.include_router(material.router)
app.include_router(printer.router)
app.include_router(auth.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)