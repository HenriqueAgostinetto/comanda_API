from fastapi import APIRouter

router = APIRouter()


@router.post("/funcionarios")
def criar_funcionario(funcionario: dict):
    return {
        "mensagem": "funcionario criado",
        "dados": funcionario
    }

# Henrique Agostinetto Piva