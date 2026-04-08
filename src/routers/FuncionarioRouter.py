from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List

# Domain Schemas
from src.domain.schemas.FuncionarioSchema import (
    FuncionarioCreate,
    FuncionarioUpdate,
    FuncionarioResponse
)
from src.domain.schemas.AuthSchema import FuncionarioAuth

# Infra
from src.infra.orm.FuncionarioModel import FuncionarioDB
from src.infra.database import get_db
from src.infra.security import get_password_hash
from src.infra.dependencies import get_current_active_user, require_group, get_rate_limit
from src.infra.rate_limit import limiter
# Auditoria
from src.services.AuditoriaService import AuditoriaService

router = APIRouter()

# Criar as rotas/endpoints: GET, POST, PUT, DELETE
@router.get("/funcionario/", response_model=List[FuncionarioResponse], tags=["Funcionário"], status_code=status.HTTP_200_OK)
@limiter.limit(get_rate_limit("moderate")) # limite de requisições para este endpoint
async def get_funcionario(
    request: Request,
    db: Session = Depends(get_db),
    current_user: FuncionarioAuth = Depends(require_group([1]))
): 
    """Retorna todos os funcionários"""
    try:
        funcionarios = db.query(FuncionarioDB).all()

        # AUDITORIA
        AuditoriaService.registrar_acao(
            db=db,
            funcionario_id=current_user.id,
            acao="READ",
            recurso="FUNCIONARIO",
            request=request
        )

        return funcionarios
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar funcionários: {str(e)}"
        )


@router.get("/funcionario/{id}", response_model=FuncionarioResponse, tags=["Funcionário"], status_code=status.HTTP_200_OK)
async def get_funcionario(
    request: Request,
    id: int,
    db: Session = Depends(get_db),
    current_user: FuncionarioAuth = Depends(get_current_active_user)
):
    """Retorna um funcionário específico pelo ID"""
    try:
        funcionario = db.query(FuncionarioDB).filter(FuncionarioDB.id == id).first()
    
        if not funcionario:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Funcionário não encontrado")

        # AUDITORIA
        AuditoriaService.registrar_acao(
            db=db,
            funcionario_id=current_user.id,
            acao="READ",
            recurso="FUNCIONARIO",
            request=request
        )
    
        return funcionario
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar funcionário: {str(e)}"
        )


@router.post("/funcionario/", response_model=FuncionarioResponse, status_code=status.HTTP_201_CREATED, tags=["Funcionário"])
@limiter.limit(get_rate_limit("restrictive"))
async def post_funcionario(
    request: Request,
    funcionario_data: FuncionarioCreate,
    db: Session = Depends(get_db)
):
    """Cria um novo funcionário"""
    try:
        # Verifica se já existe funcionário com este CPF
        existing_funcionario = db.query(FuncionarioDB).filter(FuncionarioDB.cpf == funcionario_data.cpf).first()
       
        if existing_funcionario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Já existe um funcionário com este CPF"
            )
        
        # Hash da senha
        hashed_password = get_password_hash(funcionario_data.senha)

        # Cria o novo funcionário
        novo_funcionario = FuncionarioDB(
            id=None,
            nome=funcionario_data.nome,
            matricula=funcionario_data.matricula,
            cpf=funcionario_data.cpf,
            telefone=funcionario_data.telefone,
            grupo=funcionario_data.grupo,
            senha=hashed_password
        )

        db.add(novo_funcionario)
        db.commit()
        db.refresh(novo_funcionario)

        # AUDITORIA
        AuditoriaService.registrar_acao(
            db=db,
            funcionario_id=1,
            acao="CREATE",
            recurso="FUNCIONARIO",
            request=request
        )
    
        return novo_funcionario
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao criar funcionário: {str(e)}"
        )


@router.put("/funcionario/{id}", response_model=FuncionarioResponse, tags=["Funcionário"], status_code=status.HTTP_200_OK)
@limiter.limit(get_rate_limit("restrictive"))
async def put_funcionario(
    request: Request,
    id: int,
    funcionario_data: FuncionarioUpdate,
    db: Session = Depends(get_db),
    current_user: FuncionarioAuth = Depends(require_group([1]))
):
    """Atualiza um funcionário existente"""
    try:
        funcionario = db.query(FuncionarioDB).filter(FuncionarioDB.id == id).first()
        
        if not funcionario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Funcionário não encontrado"
            )
        
        existing_funcionario = None

        # Verifica se está tentando atualizar para um CPF que já existe
        if funcionario_data.cpf and funcionario_data.cpf != funcionario.cpf:
            existing_funcionario = db.query(FuncionarioDB).filter(FuncionarioDB.cpf == funcionario_data.cpf).first()
        
        if existing_funcionario:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Já existe um funcionário com este CPF"
            )
        
        # Hash da senha se fornecida nova senha
        if funcionario_data.senha:
            funcionario_data.senha = get_password_hash(funcionario_data.senha)

        # Atualiza apenas os campos fornecidos
        update_data = funcionario_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(funcionario, field, value)

        db.commit()
        db.refresh(funcionario)

        # AUDITORIA
        AuditoriaService.registrar_acao(
            db=db,
            funcionario_id=current_user.id,
            acao="UPDATE",
            recurso="FUNCIONARIO",
            request=request
        )
        
        return funcionario
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro ao atualizar funcionário: {str(e)}"
        )


@router.delete("/funcionario/{id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Funcionário"], summary="Remover funcionário")
@limiter.limit(get_rate_limit("critical"))
async def delete_funcionario(
    request: Request,
    id: int,
    db: Session = Depends(get_db),
    current_user: FuncionarioAuth = Depends(require_group([1]))
):
    """Remove um funcionário"""
    try:
        funcionario = db.query(FuncionarioDB).filter(FuncionarioDB.id == id).first()
    
        if not funcionario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Funcionário não encontrado"
            )
    
        db.delete(funcionario)
        db.commit()

        # AUDITORIA
        AuditoriaService.registrar_acao(
            db=db,
            funcionario_id=current_user.id,
            acao="DELETE",
            recurso="FUNCIONARIO",
            request=request
        )
    
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao deletar funcionário: {str(e)}"
        )