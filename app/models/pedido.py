from sqlalchemy import Column, Integer, Numeric, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class EstadoPedido(enum.Enum):
    pendiente = "pendiente"
    pagado = "pagado"
    enviado = "enviado"
    entregado = "entregado"
    cancelado = "cancelado"

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    estado = Column(Enum(EstadoPedido), default=EstadoPedido.pendiente)
    direccion_envio = Column(String, nullable=False)

    usuario = relationship("Usuario", back_populates="pedidos")
    items = relationship("PedidoItem", back_populates="pedido", cascade="all, delete-orphan")
    @property
    def usuario_nombre(self):
        return self.usuario.nombre if self.usuario else None


class PedidoItem(Base):
    __tablename__ = "pedido_items"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)

    pedido = relationship("Pedido", back_populates="items")
    producto = relationship("Producto")