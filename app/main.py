from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.routers import categorias, productos, usuarios, carrito, pedidos

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(categorias.router)
app.include_router(productos.router)
app.include_router(usuarios.router)
app.include_router(carrito.router)
app.include_router(pedidos.router)

@app.get("/")
def root():
    return {"mensaje": "Bienvenido al API de Ecommerce 🛒"}