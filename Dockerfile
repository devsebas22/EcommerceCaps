# Stage 1: Build frontend - Construye la aplicación frontend en una imagen temporal
# Utiliza imagen oficial de Node.js versión 20 basada en Alpine Linux
FROM node:20-alpine AS frontend-builder
# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app
# Copia los archivos de configuración de npm (package.json y package-lock.json si existe)
COPY frontend/package*.json ./
# Instala las dependencias del proyecto usando npm ci (limpio e íntegro)
RUN npm ci
# Copia todos los archivos del frontend al directorio de trabajo
COPY frontend/ ./
# Define argumentos de compilación para las variables de entorno de Vite
ARG VITE_API_URL=/api
ARG VITE_IMGBB_KEY
ARG VITE_WOMPI_PUBLIC_KEY
ARG VITE_WOMPI_INTEGRITY_KEY
# Establece las variables de entorno con los valores de los argumentos
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMGBB_KEY=$VITE_IMGBB_KEY
ENV VITE_WOMPI_PUBLIC_KEY=$VITE_WOMPI_PUBLIC_KEY
ENV VITE_WOMPI_INTEGRITY_KEY=$VITE_WOMPI_INTEGRITY_KEY
# Ejecuta el script de construcción de Vite para generar los archivos estáticos optimizados
RUN npm run build


# Stage 2: Backend - Construye la imagen final con el servidor backend
# Utiliza imagen oficial de Python 3.12 versión slim para reducir tamaño
FROM python:3.12-slim
# Desactiva el almacenamiento en caché de bytecode y buffering de stdout para logs en tiempo real
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app
# Actualiza los índices de paquetes e instala las dependencias del sistema necesarias para PostgreSQL y compilación
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc && rm -rf /var/lib/apt/lists/*
# Copia el archivo de requisitos de Python al contenedor
COPY requirements.txt .
# Instala las dependencias de Python especificadas en requirements.txt sin caché
RUN pip install --no-cache-dir -r requirements.txt
# Copia la carpeta de la aplicación principal
COPY app/ app/
# Copia la carpeta de migraciones de base de datos (Alembic)
COPY alembic/ alembic/
# Copia el archivo de configuración de Alembic
COPY alembic.ini .
# Copia los archivos estáticos compilados del frontend desde el stage anterior
COPY --from=frontend-builder /app/dist /app/static
# Copia el script de entrypoint que ejecuta migraciones antes de arrancar
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
# Expone el puerto 8000 para que el servidor sea accesible externamente
EXPOSE 8000
# Entrypoint: ejecuta migraciones y luego pasa al comando CMD
ENTRYPOINT ["./entrypoint.sh"]
# Comando por defecto: ejecuta Uvicorn con la aplicación FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]