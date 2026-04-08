from fastapi import APIRouter
from datetime import datetime
import psutil

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "ok",
        "timestamp": str(datetime.now())
    }

@router.get("/health/full")
def health_full():
    return {
        "status": "ok",
        "cpu": psutil.cpu_percent(),
        "memory": psutil.virtual_memory().percent,
        "timestamp": str(datetime.now())
    }