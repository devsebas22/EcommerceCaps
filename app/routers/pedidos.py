from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.pedido import Pedido, PedidoItem
from app.models.carrito import Carrito, CarritoItem
from app.models.usuario import Usuario
from app.schemas.pedido import PedidoCreate, PedidoResponse

router = APIRouter(
    prefix="/pedidos",
    tags=["Pedidos"]
)

@router.post("/{usuario_id}", response_model=PedidoResponse)
def crear_pedido(usuario_id: int, datos: PedidoCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    carrito = db.query(Carrito).filter(Carrito.usuario_id == usuario_id).first()
    if not carrito or len(carrito.items) == 0:
        raise HTTPException(status_code=400, detail="El carrito está vacío")
    total = sum(item.producto.precio * item.cantidad for item in carrito.items)
    nuevo_pedido = Pedido(
        usuario_id=usuario_id,
        total=total,
        direccion_envio=datos.direccion_envio
    )
    db.add(nuevo_pedido)
    db.flush()
    for item in carrito.items:
        pedido_item = PedidoItem(
            pedido_id=nuevo_pedido.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=item.producto.precio
        )
        db.add(pedido_item)
        db.delete(item)
    db.commit()
    db.refresh(nuevo_pedido)
    return nuevo_pedido

@router.get("/historial/{usuario_id}", response_model=list[PedidoResponse])
def historial_pedidos(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    pedidos = db.query(Pedido).filter(Pedido.usuario_id == usuario_id).all()
    return pedidos