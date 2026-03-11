from fastapi import FastAPI
import uvicorn

from src.routers import ClienteRouter
from src.routers import ProdutoRouter
from src.routers import FuncionarioRouter

app = FastAPI()

app.include_router(ClienteRouter.router)
app.include_router(ProdutoRouter.router)
app.include_router(FuncionarioRouter.router)

if __name__ == "__main__":
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)


    # Henrique Agostinetto Piva