from fastapi import APIRouter
from src.database import get_connection

router = APIRouter()

@router.post("/produtos")
def criar_produto(produto: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO produtos (nome, preco) VALUES (?, ?)",
        (produto["nome"], produto["preco"])
    )
    conn.commit()
    conn.close()

    return {"msg": "produto criado"}


@router.get("/produtos")
def listar_produtos():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM produtos")
    dados = cursor.fetchall()

    conn.close()
    return {"produtos": dados}


@router.put("/produtos/{id}")
def atualizar_produto(id: int, produto: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE produtos SET nome=?, preco=? WHERE id=?",
        (produto["nome"], produto["preco"], id)
    )
    conn.commit()
    conn.close()

    return {"msg": "produto atualizado"}


@router.delete("/produtos/{id}")
def deletar_produto(id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM produtos WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return {"msg": "produto deletado"}