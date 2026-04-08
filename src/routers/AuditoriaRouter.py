from fastapi import APIRouter, Request
from typing import Optional
from src.infra.rate_limit import limiter, get_rate_limit

router = APIRouter()

@router.get("/auditoria")
@limiter.limit(get_rate_limit("moderate"))
async def listar_auditoria(request: Request, acao: Optional[str] = None):
                                                                                    # Henrique Agostinetto Piva
    logs = [
        {"acao": "CREATE", "detalhes": "Cadastro de um novo Funcionário", "tabela": "funcionarios"},
        {"acao": "UPDATE", "detalhes": "Edição de um Cliente", "tabela": "clientes"},
        {"acao": "DELETE", "detalhes": "Exclusão de um Produto", "tabela": "produtos"},
        {"acao": "LOGIN",  "detalhes": "Login de um Funcionário", "tabela": "auth"}
    ]
    
    
    if acao:
        logs_filtrados = [log for log in logs if log["acao"].upper() == acao.upper()]
        return logs_filtrados
        
  
    return logs