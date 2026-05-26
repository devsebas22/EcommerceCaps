from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.auth import crear_token, get_admin_actual, get_usuario_actual
from app.database import get_db
from app.models.producto import Producto
from app.models.usuario import Usuario
from app.schemas.usuario import LoginRequest, LoginResponse, UsuarioCreate, UsuarioResponse, UsuarioUpdate

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashear_password(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/", response_model=UsuarioResponse)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password=hashear_password(usuario.password),
        direccion=usuario.direccion,
        telefono=usuario.telefono
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.get("/{id}", response_model=UsuarioResponse)
def obtener_usuario(id: int, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    if usuario_actual.id != id and not usuario_actual.es_admin:
        raise HTTPException(status_code=403, detail="No autorizado")
    usuario = db.query(Usuario).filter(Usuario.id == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.put("/{id}", response_model=UsuarioResponse)
def actualizar_usuario(id: int, datos: UsuarioUpdate, db: Session = Depends(get_db), usuario_actual: Usuario = Depends(get_usuario_actual)):
    if usuario_actual.id != id:
        raise HTTPException(status_code=403, detail="No autorizado para modificar este usuario")
    usuario = db.query(Usuario).filter(Usuario.id == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.nombre = datos.nombre
    usuario.email = datos.email
    usuario.direccion = datos.direccion
    usuario.telefono = datos.telefono
    db.commit()
    db.refresh(usuario)
    return usuario

@router.delete("/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db), admin: Usuario = Depends(get_admin_actual)):
    usuario = db.query(Usuario).filter(Usuario.id == id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if usuario.es_admin:
        raise HTTPException(status_code=400, detail="No se puede eliminar a otro administrador")
    for pedido in usuario.pedidos:
        if pedido.estado.value in ("pagado", "enviado", "entregado"):
            for item in pedido.items:
                producto = db.query(Producto).filter(Producto.id == item.producto_id).first()
                if producto:
                    producto.stock += item.cantidad
    db.delete(usuario)
    db.commit()
    return {"mensaje": "Usuario eliminado correctamente"}

@router.get("/", response_model=list[UsuarioResponse])
def obtener_usuarios(db: Session = Depends(get_db), admin: Usuario = Depends(get_admin_actual)):
    return db.query(Usuario).all()

@router.post("/login", response_model=LoginResponse)
def login(datos: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == datos.email).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if not pwd_context.verify(datos.password, usuario.password):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")
    token = crear_token({
        "usuario_id": usuario.id,
        "es_admin": usuario.es_admin,
        "email": usuario.email,
    })
    return LoginResponse(
        id=usuario.id,
        nombre=usuario.nombre,
        email=usuario.email,
        telefono=usuario.telefono,
        direccion=usuario.direccion,
        es_admin=usuario.es_admin,
        puntos_fidelidad=usuario.puntos_fidelidad,
        mensaje="Login exitoso",
        access_token=token,
    )
