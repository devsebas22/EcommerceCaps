from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
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

app.include_router(categorias.router, prefix="/api")
app.include_router(productos.router, prefix="/api")
app.include_router(usuarios.router, prefix="/api")
app.include_router(carrito.router, prefix="/api")
app.include_router(pedidos.router, prefix="/api")
app.include_router(imagenes.router, prefix="/api")
app.include_router(stats.router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

# Serve SPA frontend — must be last to avoid hijacking API routes
static_dir = Path(__file__).resolve().parent.parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")