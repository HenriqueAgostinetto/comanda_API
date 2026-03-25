from fastapi import APIRouter
from src.database import get_connection

router = APIRouter()

@router.post("/funcionarios")
def criar_funcionario(funcionario: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO funcionarios (nome, cargo) VALUES (?, ?)",
        (funcionario["nome"], funcionario["cargo"])
    )
    conn.commit()
    conn.close()

    return {"msg": "funcionario criado"}


@router.get("/funcionarios")
def listar_funcionarios():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM funcionarios")
    dados = cursor.fetchall()

    conn.close()
    return {"funcionarios": dados}


@router.put("/funcionarios/{id}")
def atualizar_funcionario(id: int, funcionario: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE funcionarios SET nome=?, cargo=? WHERE id=?",
        (funcionario["nome"], funcionario["cargo"], id)
    )
    conn.commit()
    conn.close()

    return {"msg": "funcionario atualizado"}


@router.delete("/funcionarios/{id}")
def deletar_funcionario(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM funcionarios WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return {"msg": "funcionario deletado"}