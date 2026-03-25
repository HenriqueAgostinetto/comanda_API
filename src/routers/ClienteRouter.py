# Henrique Agostinetto Piva

from fastapi import APIRouter
from src.database import get_connection

router = APIRouter()


@router.post("/clientes")
def criar_cliente(cliente: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO clientes (nome, cpf, telefone) VALUES (?, ?, ?)",
        (cliente["nome"], cliente["cpf"], cliente["telefone"])
    )

    conn.commit()
    conn.close()

    return {"msg": "cliente criado"}


@router.get("/clientes")
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM clientes")
    dados = cursor.fetchall()

    conn.close()
    return {"clientes": dados}


@router.put("/clientes/{id}")
def atualizar_cliente(id: int, cliente: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE clientes SET nome=?, cpf=?, telefone=? WHERE id=?",
        (cliente["nome"], cliente["cpf"], cliente["telefone"], id)
    )

    conn.commit()
    conn.close()

    return {"msg": "cliente atualizado"}


@router.delete("/clientes/{id}")
def deletar_cliente(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM clientes WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return {"msg": "cliente deletado"}