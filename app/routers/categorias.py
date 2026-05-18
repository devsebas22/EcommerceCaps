from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.categoria import Categoria
from app.models.producto import Producto
from app.schemas.categoria import CategoriaCreate, CategoriaResponse

router = APIRouter(
    prefix="/categorias",
    tags=["Categorias"]
)

@router.get("/", response_model=list[CategoriaResponse])
def obtener_categorias(db: Session = Depends(get_db)):
    categorias = db.query(Categoria).order_by(Categoria.id).all()
    return categorias

@router.get("/{id}", response_model=CategoriaResponse)
def obtener_categoria(id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

@router.post("/", response_model=CategoriaResponse)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    nueva_categoria = Categoria(**categoria.model_dump())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

@router.delete("/{id}")
def eliminar_categoria(id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    productos_count = db.query(Producto).filter(Producto.categoria_id == id).count()
    if productos_count > 0:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar la categoría porque tiene productos asociados"
        )
    db.delete(categoria)
    db.commit()
    return {"mensaje": "Categoría eliminada correctamente"}

@router.put("/{id}", response_model=CategoriaResponse)
def actualizar_categoria(id: int, datos: CategoriaCreate, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    categoria.nombre = datos.nombre
    categoria.descripcion = datos.descripcion
    db.commit()
    db.refresh(categoria)
    return categoria