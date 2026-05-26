#!/usr/bin/env -S zsh -i

source ~/.zshrc

trap "kill 0" EXIT

# Liberar puerto 8000 por si quedó un proceso anterior
kill $(lsof -ti :8000) 2>/dev/null || true

echo "🐳 Iniciando PostgreSQL..."
docker compose up -d postgres --remove-orphans

echo "📦 Ejecutando migraciones..."
alembic upgrade head

echo "🚀 Iniciando Backend (FastAPI)..."
source .venv/bin/activate
uvicorn app.main:app --reload --env-file .env &

echo "🎨 Iniciando Frontend (Vite)..."
cd frontend
npm run dev