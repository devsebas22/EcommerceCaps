# EcommerceCaps 🛒

Plataforma de e-commerce dedicada a la venta de gorras, lociones y relojes.

## Tecnologías

- **Backend:** FastAPI (Python)
- **Base de datos:** PostgreSQL 16
- **Contenedores:** Docker + pgAdmin
- **Frontend:** HTML, CSS y JavaScript vanilla

## Requisitos previos

- Python 3.12+
- Docker Desktop
- WSL2 (Ubuntu 24.04)

## Instalación y configuración

### 1. Clonar el repositorio

git clone https://github.com/devsebas22/EcommerceCaps.git
cd EcommerceCaps/proyectoFinal

### 2. Crear el entorno virtual

python3 -m venv venv
source venv/bin/activate

### 3. Instalar dependencias

pip install -r requirements.txt

### 4. Configurar variables de entorno

Crea un archivo `.env` con:

DATABASE_URL=postgresql://ecommerce_user:ecommerce123@127.0.0.1:5433/ecommerce_db

### 5. Levantar la base de datos

docker compose up -d

### 6. Arrancar el servidor

uvicorn app.main:app --reload --env-file .env

### 7. Documentación de la API

Abre en el navegador:
http://127.0.0.1:8000/docs

## Estructura del proyecto

proyectoFinal/
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/
│   ├── routers/
│   └── schemas/
├── docker-compose.yml
└── requirements.txt