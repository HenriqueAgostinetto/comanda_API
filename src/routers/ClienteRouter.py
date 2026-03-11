from fastapi import APIRouter


router = APIRouter()


@router.put("/clientes")
def atualizar_cliente(cliente: dict):
    return {
        "mensagem": "cliente atualizado",
        "dados": cliente
    }
# Henrique Agostinetto Piva