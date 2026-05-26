#!/usr/bin/env -S zsh -i

source ~/.zshrc

trap "kill 0" EXIT

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