from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from infra.database import get_db
from infra.orm.FuncionarioModel import FuncionarioDB
from infra.security import verify_access_token

from domain.schemas.AuthSchema import FuncionarioAuth


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> FuncionarioAuth:
    """Dependency que valida o token e retorna o usuário atual"""

                                                        # Henrique Agostinetto Piva
    payload = verify_access_token(credentials.credentials)
    cpf: str = payload.get("sub")
    id_funcionario: int = payload.get("id")
    
    if cpf is None or id_funcionario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido - dados incompletos", headers={"WWW-Authenticate": "Bearer"},
        )

    
    funcionario = db.query(FuncionarioDB).filter(FuncionarioDB.id == id_funcionario).first()
    
    if not funcionario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Funcionário não encontrado", headers={"WWW-Authenticate": "Bearer"},
        )

    
    if funcionario.cpf != cpf:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido - CPF não corresponde", headers={"WWW-Authenticate": "Bearer"},
        )

    return FuncionarioAuth(
        id=funcionario.id,
        nome=funcionario.nome,
        matricula=funcionario.matricula,
        cpf=funcionario.cpf,
        grupo=funcionario.grupo
    )


def get_current_active_user(current_user: FuncionarioAuth = Depends(get_current_user)) -> FuncionarioAuth:
    """Dependency que verifica se o usuário está ativo (pode ser expandida)"""
    
    return current_user


def require_group(group_required: list[int] = None):
    """
    Factory function que cria dependency para verificar grupo do usuário
    Args:
    group_required: list[int] or None
    - list[int]: Verifica se usuário pertence a qualquer um dos grupos listados
    - None: Permite qualquer usuário autenticado
    Returns:
    Dependency function para uso em rotas
    """
    def check_group(current_user: FuncionarioAuth = Depends(get_current_active_user)) -> FuncionarioAuth:
    
        if group_required is None:
            return current_user
        
        
        if current_user.grupo not in group_required:
            groups_str = ", ".join(map(str, group_required))
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail=f"Permissão negada - requerido um dos grupos: {groups_str}"
            )
        
        return current_user
    return check_group

# Exemplos de uso:
# @router.get("/admin/dashboard")
# async def admin_dashboard(current_user: FuncionarioAuth = Depends(require_group([1]))):
# # Apenas grupo 1 (admin)
#
# @router.get("/shared/reports")
# async def shared_reports(current_user: FuncionarioAuth = Depends(require_group([1, 3]))):
# # Grupo 1 ou 3
#
# @router.get("/user/profile")
# async def user_profile(current_user: FuncionarioAuth = Depends(require_group(None))):
# # Qualquer usuário autenticado