# Usa la imagen base de Python 3.12 en versión slim (más ligera)
FROM python:3.12-slim

# Define variables de entorno para Python
# PYTHONUNBUFFERED=1: Los logs se muestran en tiempo real sin buffering
# PYTHONDONTWRITEBYTECODE=1: Evita crear archivos .pyc para reducir tamaño
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala dependencias del sistema necesarias
# apt-get update: Actualiza el índice de paquetes
# apt-get install -y: Instala paquetes (libpq-dev para PostgreSQL, gcc para compilación)
# --no-install-recommends: Evita instalar paquetes recomendados innecesarios
# rm -rf /var/lib/apt/lists/*: Elimina caché de apt para reducir tamaño de imagen
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia el archivo de dependencias Python desde el host al contenedor
COPY requirements.txt .

# Instala las dependencias Python
# pip install: Instala paquetes desde requirements.txt
# --no-cache-dir: No almacena el caché de pip para reducir tamaño
RUN pip install --no-cache-dir -r requirements.txt

# Copia el directorio app/ desde el host al contenedor
COPY app/ app/

# Copia el directorio alembic/ (migraciones de base de datos) desde el host al contenedor
COPY alembic/ alembic/

# Copia el archivo de configuración alembic.ini al contenedor
COPY alembic.ini .

# Expone el puerto 8000 (la aplicación escuchará en este puerto)
EXPOSE 8000

# Comando por defecto al ejecutar el contenedor
# Inicia uvicorn (servidor ASGI) con la app en todas las interfaces (0.0.0.0) puerto 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]