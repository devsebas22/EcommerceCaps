from pydantic import BaseModel

from app.models.pedido import EstadoPedido
from app.schemas.producto import ProductoResponse


class PedidoItemResponse(BaseModel):
    id: int
    producto_id: int
    cantidad: int
    precio_unitario: float
    producto: ProductoResponse

    class Config:
        from_attributes = True

class PedidoCreate(BaseModel):
    direccion_envio: str

class PedidoResponse(BaseModel):
    id: int
    usuario_id: int
    usuario_nombre: str | None = None
    total: float
    estado: EstadoPedido
    direccion_envio: str
    items: list[PedidoItemResponse] = []


    class Config:
        from_attributes = True
