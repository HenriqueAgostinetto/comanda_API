from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from src.infra.database import Base

# henrique agostinetto piva

class ComandaDB(Base):
    __tablename__ = "tb_comanda"

    id = Column(Integer, primary_key=True, index=True)
    comanda = Column(String, index=True, nullable=False)
    data_hora = Column(DateTime, default=datetime.now, nullable=False)
    status = Column(Integer, default=0, nullable=False) # 0=aberta, 1=fechada, 2=cancelada
    cliente_id = Column(Integer, ForeignKey("tb_cliente.id"), nullable=True)
    funcionario_id = Column(Integer, ForeignKey("tb_funcionario.id"), nullable=False)

class ComandaProdutoDB(Base):
    __tablename__ = "tb_comanda_produto"

    id = Column(Integer, primary_key=True, index=True)
    comanda_id = Column(Integer, ForeignKey("tb_comanda.id"), nullable=False)
    produto_id = Column(Integer, ForeignKey("tb_produto.id"), nullable=False)
    quantidade = Column(Integer, nullable=False)
    valor_unitario = Column(Float, nullable=False)
    funcionario_id = Column(Integer, ForeignKey("tb_funcionario.id"), nullable=False)
    data_hora = Column(DateTime, default=datetime.now, nullable=False)