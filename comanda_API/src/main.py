from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from settings import HOST, PORT, RELOAD

# Rate limit
from infra.rate_limit import limiter, rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Routers
from routers import (
    FuncionarioRouter,
    ClienteRouter,                                      # Henrique Agostinetto Piva
    ProdutoRouter,
    AuthRouter,
    AuditoriaRouter,
    HealthRouter,
    ComandaRouter
)

# Database
from infra import database


# lifespan - ciclo de vida da aplicacao
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("API has started")
    await database.cria_tabelas()
    yield
    print("API is shutting down")


# FastAPI app
app = FastAPI(lifespan=lifespan)

# configuracao do cors - permite que o frontend se conecte a api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permite requisições de qualquer origem (ideal para dev)
    allow_credentials=True,
    allow_methods=["*"],  # permite todos os metodos (POST, GET, PUT, DELETE)
    allow_headers=["*"],  # permite todos os cabecalhos (incluindo o token de autorizacao)
)

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
app.include_router(ComandaRouter.router)


# Run
if __name__ == "__main__":
    uvicorn.run("main:app", host=HOST, port=int(PORT), reload=RELOAD)