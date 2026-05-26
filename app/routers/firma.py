import hashlib
import os

from fastapi import APIRouter, Depends, Query

from app.auth import get_usuario_actual
from app.models.usuario import Usuario

router = APIRouter(prefix="/wompi", tags=["Wompi"])

_INTEGRITY_KEY = os.getenv("WOMPI_INTEGRITY_KEY", "")


@router.get("/firma")
def calcular_firma(
    reference: str = Query(...),
    amount: int = Query(..., ge=0),
    _: Usuario = Depends(get_usuario_actual),
):
    cadena = f"{reference}{amount}COP{_INTEGRITY_KEY}"
    return {"signature": hashlib.sha256(cadena.encode()).hexdigest()}
