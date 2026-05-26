import os
from pathlib import Path

import sentry_sdk
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.routers import (
    auth_recovery,
    carrito,
    categorias,
    firma,
    imagenes,
    pedidos,
    productos,
    stats,
    usuarios,
    webhook,
)

load_dotenv()

_sentry_dsn = os.getenv("SENTRY_DSN", "")
if _sentry_dsn:
    sentry_sdk.init(dsn=_sentry_dsn, traces_sample_rate=0.2)

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
app.include_router(webhook.router, prefix="/api")
app.include_router(firma.router, prefix="/api")
app.include_router(auth_recovery.router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

# SPA fallback — registrar DESPUÉS de todas las rutas /api/*
# Sirve archivos estáticos si existen; de lo contrario index.html para React Router
_static_dir = Path(__file__).resolve().parent.parent / "static"

if _static_dir.exists():
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        candidate = _static_dir / full_path
        if candidate.is_file():
            return FileResponse(str(candidate))
        return FileResponse(str(_static_dir / "index.html"))
