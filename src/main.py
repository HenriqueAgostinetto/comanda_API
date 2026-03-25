from fastapi import FastAPI
from src.routers import ClienteRouter, ProdutoRouter, FuncionarioRouter

app = FastAPI()

app.include_router(ClienteRouter.router)
app.include_router(ProdutoRouter.router)
app.include_router(FuncionarioRouter.router)