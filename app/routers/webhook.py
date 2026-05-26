import hashlib
import os

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.pedido import EstadoPedido, Pedido
from app.models.producto import Producto
from app.models.usuario import Usuario

router = APIRouter(prefix="/webhook", tags=["Webhook"])

WOMPI_EVENTS_SECRET = os.getenv("WOMPI_EVENTS_SECRET", "")


def _get_nested(obj: dict, path: str) -> str:
    """Extrae un valor anidado de un dict usando notación 'a.b.c'."""
    for part in path.split("."):
        if not isinstance(obj, dict):
            return ""
        obj = obj.get(part, "")
    return str(obj)


def _verificar_firma(payload: dict) -> bool:
    """
    Wompi firma el evento concatenando los valores de las propiedades
    indicadas en signature.properties + timestamp + events_secret, y hace SHA-256.
    Si WOMPI_EVENTS_SECRET no está configurado se deja pasar (entorno local).
    """
    if not WOMPI_EVENTS_SECRET:
        return True
    try:
        signature = payload.get("signature", {})
        properties = signature.get("properties", [])
        checksum = signature.get("checksum", "")
        timestamp = str(payload.get("timestamp", ""))

        valores = [_get_nested(payload, prop) for prop in properties]
        cadena = "".join(valores) + timestamp + WOMPI_EVENTS_SECRET
        computado = hashlib.sha256(cadena.encode()).hexdigest()
        return computado == checksum
    except Exception:
        return False


@router.post("/wompi")
async def wompi_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()

    if not _verificar_firma(payload):
        raise HTTPException(status_code=400, detail="Firma de webhook inválida")

    event = payload.get("event")
    if event != "transaction.updated":
        return {"status": "ok"}

    transaction = payload.get("data", {}).get("transaction", {})
    status = transaction.get("status")
    reference = transaction.get("reference", "")

    if status != "APPROVED" or not reference.startswith("pedido-"):
        return {"status": "ok"}

    try:
        pedido_id = int(reference.split("-")[1])
    except (IndexError, ValueError):
        return {"status": "ok"}

    pedido = db.query(Pedido).filter(Pedido.id == pedido_id).first()
    if not pedido or pedido.estado != EstadoPedido.pendiente:
        return {"status": "ok"}

    # Descontar stock item a item
    for pedido_item in pedido.items:
        producto = db.query(Producto).filter(Producto.id == pedido_item.producto_id).first()
        if producto and producto.stock >= pedido_item.cantidad:
            producto.stock -= pedido_item.cantidad

    # Sumar puntos de fidelidad
    usuario = db.query(Usuario).filter(Usuario.id == pedido.usuario_id).first()
    if usuario:
        usuario.puntos_fidelidad += int(pedido.total)

    pedido.estado = EstadoPedido.pagado
    db.commit()

    return {"status": "ok"}
