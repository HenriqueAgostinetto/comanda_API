from fastapi import APIRouter, Request
from src.infra.rate_limit import limiter, get_rate_limit

router = APIRouter()

@router.get("/auditoria")
@limiter.limit(get_rate_limit("moderate"))
async def listar_auditoria(request: Request):
    return [
        {"acao": "CREATE"},
        {"acao": "UPDATE"},
        {"acao": "DELETE"},
        {"acao": "LOGIN"}
    ]