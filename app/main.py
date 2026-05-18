from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base
from app import models
from app.routers import categorias, productos, usuarios, carrito, pedidos, imagenes, stats
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in _raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categorias.router)
app.include_router(productos.router)
app.include_router(usuarios.router)
app.include_router(carrito.router)
app.include_router(pedidos.router)
app.include_router(imagenes.router)
app.include_router(stats.router)

@app.get("/")
def root():
    return {"mensaje": "Bienvenido al API de Ecommerce 🛒"}