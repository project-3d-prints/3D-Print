from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routes import auth, printer, job, material
from dependencies import close_redis
from keycloak import KeycloakOpenID

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_redis()

app = FastAPI(lifespan=lifespan)

# Настройка Keycloak
keycloak_openid = KeycloakOpenID(
    server_url="http://localhost:8080/",
    client_id="myapp-backend",
    realm_name="3d-print-realm",
    client_secret="wxCEk9aJFvvIZAQHiWSR8RQl3XMwtOfY" 
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = keycloak_openid.decode_token(token, keycloak_openid.public_key())
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:3000/api/auth/callback/keycloak")

# Защищённый маршрут
@app.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    return {"message": "Hello, protected user!", "user": user}

# Подключение маршрутов
app.include_router(job.router)
app.include_router(material.router)
app.include_router(printer.router)
app.include_router(auth.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)