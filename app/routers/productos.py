from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.producto import Producto
from app.models.usuario import Usuario
from app.models.categoria import Categoria
from app.schemas.producto import ProductoCreate, ProductoResponse
from app.auth import get_admin_actual

router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)

@router.get("/", response_model=list[ProductoResponse])
def obtener_productos(
    db: Session = Depends(get_db),
    page: int | None = Query(None, ge=1),
    limit: int | None = Query(None, ge=1, le=200),
):
    q = db.query(Producto).options(
        joinedload(Producto.imagenes),
        joinedload(Producto.categoria),
    ).order_by(Producto.id)
    if page is not None and limit is not None:
        q = q.offset((page - 1) * limit).limit(limit)
    return q.all()

@router.get("/{id}", response_model=ProductoResponse)
def obtener_producto(id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).options(
        joinedload(Producto.imagenes),
        joinedload(Producto.categoria)
    ).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@router.post("/", response_model=ProductoResponse)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db), admin: Usuario = Depends(get_admin_actual)):
    if producto.stock < 0:
        raise HTTPException(status_code=400, detail="El stock no puede ser negativo")
    categoria = db.query(Categoria).filter(Categoria.id == producto.categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    nuevo_producto = Producto(**producto.model_dump())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@router.put("/{id}", response_model=ProductoResponse)
def actualizar_producto(id: int, datos: ProductoCreate, db: Session = Depends(get_db), admin: Usuario = Depends(get_admin_actual)):
    if datos.stock < 0:
        raise HTTPException(status_code=400, detail="El stock no puede ser negativo")
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for key, value in datos.model_dump().items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto

@router.delete("/{id}")
def eliminar_producto(id: int, db: Session = Depends(get_db), admin: Usuario = Depends(get_admin_actual)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado correctamente"}