from pydantic import BaseModel
from typing import List

class Produto(BaseModel):
    nome: str
    preco: float

class Cliente(BaseModel):
    id_cliente: int = None
    nome: str
    cpf: str
    telefone: str
    produtos: List[Produto] = []

    # Henrique Agostinetto Piva
