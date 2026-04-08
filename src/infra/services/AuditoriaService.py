from datetime import datetime

class AuditoriaService:

    @staticmethod
    def registrar_acao(db, funcionario_id, acao, recurso, request=None):
        print({
            "funcionario_id": funcionario_id,
            "acao": acao,
            "recurso": recurso,
            "ip": request.client.host if request else None,
            "data": str(datetime.now())
        })