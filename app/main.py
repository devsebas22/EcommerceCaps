from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- NUEVO IMPORT
from app.database import engine, Base
from app import models
from app.routers import categorias, productos, usuarios, carrito, pedidos

Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- NUEVO BLOQUE CORS ---
# Esto le dice a FastAPI que acepte peticiones desde tu frontend de Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------

app.include_router(categorias.router)
app.include_router(productos.router)
app.include_router(usuarios.router)
app.include_router(carrito.router)
app.include_router(pedidos.router)

@app.get("/")
def root():
    return {"mensaje": "Bienvenido al API de Ecommerce 🛒"}