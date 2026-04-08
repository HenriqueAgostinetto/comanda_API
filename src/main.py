from fastapi import FastAPI
from contextlib import asynccontextmanager
import uvicorn

from src.settings import HOST, PORT, RELOAD

# Rate limit
from src.infra.rate_limit import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Routers
from src.routers import (
    FuncionarioRouter,
    ClienteRouter,
    ProdutoRouter,
    AuthRouter,
    AuditoriaRouter,
    HealthRouter
)

# Database
from src.infra import database


# lifespan - ciclo de vida da aplicação
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("API has started")
    await database.cria_tabelas()
    yield
    print("API is shutting down")


# FastAPI app
app = FastAPI(lifespan=lifespan)

# Rate limit config
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)


# Rota raiz
@app.get("/", tags=["Root"], status_code=200)
async def root():
    return {
        "detail": "API Pastelaria",
        "Swagger UI": "http://127.0.0.1:8000/docs",
        "ReDoc": "http://127.0.0.1:8000/redoc"
    }


# Rotas
app.include_router(AuthRouter.router)
app.include_router(FuncionarioRouter.router)
app.include_router(ClienteRouter.router)
app.include_router(ProdutoRouter.router)
app.include_router(AuditoriaRouter.router)
app.include_router(HealthRouter.router)


# Run
if __name__ == "__main__":
    uvicorn.run("src.main:app", host=HOST, port=int(PORT), reload=RELOAD)

    # Henrique Agostinetto Piva