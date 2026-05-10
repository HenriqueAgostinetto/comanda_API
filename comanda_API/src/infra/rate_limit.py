from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

limiter = Limiter(key_func=get_remote_address)

def get_rate_limit(tipo: str):
    limits = {
        "critical": "5/minute",
        "restrictive": "20/minute",
        "moderate": "100/minute",
        "low": "200/minute",
        "default": "50/minute"
    }
    return limits.get(tipo, limits["default"])

def rate_limit_exceeded_handler(request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Muitas requisições. Tente novamente mais tarde."}
    )