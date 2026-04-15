from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from src.domain.schemas.ComandaSchema import (
    ComandaCreate, ComandaUpdate, ComandaResponse,
    ComandaProdutosCreate, ComandaProdutosUpdate, ComandaProdutosResponse
)
from src.domain.schemas.AuthSchema import FuncionarioAuth
from src.infra.orm.ComandaModel import ComandaDB, ComandaProdutoDB
from src.infra.orm.FuncionarioModel import FuncionarioDB
from src.infra.orm.ClienteModel import ClienteDB
from src.infra.orm.ProdutoModel import ProdutoDB
from src.infra.database import get_db
from src.infra.dependencies import get_current_active_user, require_group
from src.infra.rate_limit import limiter, get_rate_limit

router = APIRouter()

                                                                                    # henrique agostinetto piva

# busca comanda por id
@router.get("/comanda/{id}", response_model=ComandaResponse, tags=["Comanda"], summary="Buscar comanda por ID - protegida por JWT")
@limiter.limit(get_rate_limit("moderate"))
async def get_comanda(id: int, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(get_current_active_user)):
    try:
        # join de comanda funcionario e cliente
        row = db.query(ComandaDB, FuncionarioDB, ClienteDB)\
            .outerjoin(FuncionarioDB, FuncionarioDB.id == ComandaDB.funcionario_id)\
            .outerjoin(ClienteDB, ClienteDB.id == ComandaDB.cliente_id)\
            .filter(ComandaDB.id == id).first()
            
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comanda nao encontrada")
        comanda, funcionario, cliente = row
        comanda.funcionario = funcionario
        comanda.cliente = cliente
        return comanda
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao buscar comanda: {str(e)}")

# lista comandas com filtro
@router.get("/comanda/", response_model=List[ComandaResponse], tags=["Comanda"], summary="Listar todas as comandas - opção de filtro e paginação - protegida por JWT")
@limiter.limit(get_rate_limit("moderate"))
async def get_comandas(
    request: Request,
    skip: int = Query(0, ge=0, description="Numero de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Numero maximo de registros"),
    id: Optional[int] = Query(None, description="Filtrar por ID"),
    comanda: Optional[str] = Query(None, description="Filtrar por numero da comanda"),
    status: Optional[int] = Query(None, description="Filtrar por status: 0=aberta, 1=fechada, 2=cancelada"),
    db: Session = Depends(get_db),
    current_user: FuncionarioAuth = Depends(get_current_active_user)
):
    try:
        query = db.query(ComandaDB, FuncionarioDB, ClienteDB)\
            .outerjoin(FuncionarioDB, FuncionarioDB.id == ComandaDB.funcionario_id)\
            .outerjoin(ClienteDB, ClienteDB.id == ComandaDB.cliente_id)
            
        if id is not None:
            query = query.filter(ComandaDB.id == id)
        if comanda is not None:
            query = query.filter(ComandaDB.comanda == comanda)
        if status is not None:
            query = query.filter(ComandaDB.status == status)
        
        rows = query.offset(skip).limit(limit).all()
        comandas = []
        for row in rows:
            comanda_db, func_db, cli_db = row
            comanda_db.funcionario = func_db
            comanda_db.cliente = cli_db
            comandas.append(comanda_db)
        return comandas
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao buscar comandas: {str(e)}")

# cria comanda
@router.post("/comanda/", response_model=ComandaResponse, status_code=status.HTTP_201_CREATED, tags=["Comanda"], summary="Criar nova comanda - protegida por JWT")
@limiter.limit(get_rate_limit("restrictive"))
async def create_comanda(comanda_data: ComandaCreate, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(get_current_active_user)):
    try:
        # verifica se funcionario existe
        funcionario = db.query(FuncionarioDB).filter(FuncionarioDB.id == comanda_data.funcionario_id).first()
        if not funcionario:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Funcionario nao encontrado")
        
        # verifica cliente se foi passado
        if comanda_data.cliente_id:
            cliente = db.query(ClienteDB).filter(ClienteDB.id == comanda_data.cliente_id).first()
            if not cliente:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Cliente nao encontrado")
        
        nova_comanda = ComandaDB(**comanda_data.model_dump())
        db.add(nova_comanda)
        db.commit()
        db.refresh(nova_comanda)
        return nova_comanda
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao criar comanda: {str(e)}")

# atualiza comanda
@router.put("/comanda/{id}", response_model=ComandaResponse, tags=["Comanda"], summary="Atualizar comanda - protegida por JWT e grupo 1")
@limiter.limit(get_rate_limit("restrictive"))
async def update_comanda(id: int, comanda_data: ComandaUpdate, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(require_group([1]))):
    try:
        comanda = db.query(ComandaDB).filter(ComandaDB.id == id).first()
        if not comanda:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Comanda nao encontrada")
            
        # atualiza os campos passados
        if comanda_data.comanda is not None:
            comanda.comanda = comanda_data.comanda
        if comanda_data.status is not None:
            comanda.status = comanda_data.status
        if comanda_data.cliente_id is not None:
            comanda.cliente_id = comanda_data.cliente_id
        if comanda_data.funcionario_id is not None:
            comanda.funcionario_id = comanda_data.funcionario_id
            
        db.commit()
        db.refresh(comanda)
        return comanda
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao atualizar comanda: {str(e)}")

# cancela comanda
@router.put("/comanda/{id}/cancelar", response_model=ComandaResponse, tags=["Comanda"], summary="Cancelar comanda - protegida por JWT e grupo 1")
@limiter.limit(get_rate_limit("critical"))
async def cancelar_comanda(id: int, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(require_group([1]))):
    try:
        # busca a comanda
        comanda = db.query(ComandaDB).filter(ComandaDB.id == id).first()
        if not comanda:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Comanda nao encontrada")
        
        # checa status cancelado
        if comanda.status == 2:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Comanda ja esta cancelada")
            
        comanda.status = 2
        db.commit()
        db.refresh(comanda)
        return comanda
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao cancelar comanda: {str(e)}")

# adiciona produto
@router.post("/comanda/{comanda_id}/produto", response_model=ComandaProdutosResponse, status_code=status.HTTP_201_CREATED, tags=["Comanda"], summary="Adicionar produto a comanda - protegida por JWT")
@limiter.limit(get_rate_limit("restrictive"))
async def add_produto_to_comanda(comanda_id: int, produto_data: ComandaProdutosCreate, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(get_current_active_user)):
    try:
        # verifica comanda
        comanda = db.query(ComandaDB).filter(ComandaDB.id == comanda_id).first()
        if not comanda:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comanda nao encontrada")
            
        novo_produto = ComandaProdutoDB(comanda_id=comanda_id, **produto_data.model_dump())
        db.add(novo_produto)
        db.commit()
        db.refresh(novo_produto)
        return novo_produto
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao adicionar produto na comanda: {str(e)}")

# lista produtos da comanda
@router.get("/comanda/{id}/produtos", response_model=List[ComandaProdutosResponse], tags=["Comanda"], summary="Listar produtos de uma comanda - protegida por JWT")
@limiter.limit(get_rate_limit("moderate"))
async def get_comanda_produtos(id: int, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(get_current_active_user)):
    try:
        # verifica comanda
        comanda = db.query(ComandaDB).filter(ComandaDB.id == id).first()
        if not comanda:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Comanda nao encontrada")
            
        # busca produtos com joins
        rows = db.query(ComandaProdutoDB, ProdutoDB, FuncionarioDB)\
            .outerjoin(ProdutoDB, ComandaProdutoDB.produto_id == ProdutoDB.id)\
            .outerjoin(FuncionarioDB, ComandaProdutoDB.funcionario_id == FuncionarioDB.id)\
            .filter(ComandaProdutoDB.comanda_id == id).all()
            
        produtos = []
        for row in rows:
            cp_db, p_db, f_db = row
            cp_db.produto = p_db
            cp_db.funcionario = f_db
            produtos.append(cp_db)
        return produtos
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao listar produtos da comanda: {str(e)}")

# edita produto
@router.put("/comanda/produto/{id}", response_model=ComandaProdutosResponse, tags=["Comanda"], summary="Atualizar produto na comanda - quantidade e/ou valor - protegida por JWT e grupo 1")
@limiter.limit(get_rate_limit("restrictive"))
async def update_comanda_produto(id: int, produto_data: ComandaProdutosUpdate, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(require_group([1]))):
    try:
        # busca item
        comanda_produto = db.query(ComandaProdutoDB).filter(ComandaProdutoDB.id == id).first()
        if not comanda_produto:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Produto da comanda nao encontrado")
            
        if produto_data.quantidade is not None:
            comanda_produto.quantidade = produto_data.quantidade
        if produto_data.valor_unitario is not None:
            comanda_produto.valor_unitario = produto_data.valor_unitario
        if produto_data.funcionario_id is not None:
            comanda_produto.funcionario_id = produto_data.funcionario_id
            
        db.commit()
        db.refresh(comanda_produto)
        return comanda_produto
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao atualizar produto da comanda: {str(e)}")

# deleta produto
@router.delete("/comanda/produto/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Comanda"], summary="Remover produto da comanda - protegida por JWT e grupo 1")
@limiter.limit(get_rate_limit("critical"))
async def delete_comanda_produto(id: int, request: Request, db: Session = Depends(get_db), current_user: FuncionarioAuth = Depends(require_group([1]))):
    try:
        comanda_produto = db.query(ComandaProdutoDB).filter(ComandaProdutoDB.id == id).first()
        if not comanda_produto:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto da comanda nao encontrado")
        
        db.delete(comanda_produto)
        db.commit()
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao deletar produto da comanda: {str(e)}")