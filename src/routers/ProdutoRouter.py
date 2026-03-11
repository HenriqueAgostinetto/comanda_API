from fastapi import APIRouter

router = APIRouter()

@router.get("/produtos")
def listar_produtos():
    return {"produtos": []}

@router.post("/produtos")
def criar_produto():
    return {"mensagem": "produto criado"}

# Henrique Agostinetto Piva