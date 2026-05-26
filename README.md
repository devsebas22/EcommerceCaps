# 🛒 EcommerceCaps

> Plataforma de e-commerce dedicada a la venta de gorras, lociones y relojes.
> **Desarrollada por [Sebastián Mogollón Mendoza](https://github.com/devsebas22) y [Juan Esteban Aguirre Foronda](https://github.com/Baljeet-codes)**

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136.0-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF?style=flat&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![ghcr.io](https://img.shields.io/badge/Registry-ghcr.io-8957E5?style=flat&logo=github&logoColor=white)](https://ghcr.io)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com)
[![Supabase](https://img.shields.io/badge/DB-Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Descripción del Proyecto

EcommerceCaps es una aplicación web full-stack de comercio electrónico construida con **FastAPI** (backend) y **React + Vite** (frontend). Incluye pasarela de pagos **Wompi**, envío de correos transaccionales con **Resend**, subida de imágenes a **ImgBB** y monitoreo de errores con **Sentry**.

La aplicación se despliega automáticamente desde **GitHub Actions** hacia **Render** usando contenedores Docker almacenados en **GitHub Container Registry (ghcr.io)**, con base de datos PostgreSQL en **Supabase**.

### ✨ Características Principales

- 🔐 **Autenticación segura** con JWT y hashing de contraseñas
- 👥 **Gestión de usuarios** con roles (admin/usuario) y puntos de fidelidad
- 📦 **Catálogo de productos** con categorías, marcas, imágenes múltiples y stock
- 🛒 **Carrito de compras** persistente por usuario
- 💳 **Pagos integrados** con Wompi (widget + webhook)
- 📋 **Sistema de pedidos** completo con estados (pendiente → pagado → preparando → enviado → entregado)
- 🔐 **Recuperación de contraseña** por correo electrónico vía Resend
- 📊 **Dashboard administrativo** con estadísticas y gestión completa
- 🐘 **Base de datos PostgreSQL** gestionada con Alembic
- 🚀 **CI/CD automatizado** con GitHub Actions → ghcr.io → Render
- 📚 **Documentación interactiva** con Swagger UI

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|-------------|
| **Backend** | FastAPI (Python 3.12+) |
| **Frontend** | React 18 + Vite 5 + Bootstrap 5 |
| **Base de datos** | PostgreSQL 16 (Supabase) |
| **ORM** | SQLAlchemy 2.0 |
| **Migraciones** | Alembic |
| **Autenticación** | JWT (python-jose) + bcrypt |
| **Pagos** | Wompi (widget + webhook con firma SHA-256) |
| **Correo** | Resend API |
| **Imágenes** | ImgBB (subida desde el cliente) |
| **Errores** | Sentry SDK |
| **Contenedores** | Docker |
| **CI/CD** | GitHub Actions |
| **Registry** | GitHub Container Registry (ghcr.io) |
| **Producción** | Render + Supabase |

---

## 📋 Requisitos Previos

> ⚠️ **IMPORTANTE:** Antes de iniciar, asegúrate de tener instaladas las versiones correctas de cada herramienta.

| Herramienta | Versión Mínima | Verificar |
|-------------|----------------|-----------|
| **Python** | 3.12+ | `python3 --version` |
| **Node.js** | 18.0+ | `node --version` |
| **npm** | 9.0+ | `npm --version` |
| **Docker** | 20.10+ | `docker --version` |
| **Docker Compose** | 2.0+ | `docker compose version` |

```bash
# Verificar todas las versiones instaladas
echo "=== Python ===" && python3 --version
echo "=== Node.js ===" && node --version
echo "=== npm ===" && npm --version
echo "=== Docker ===" && docker --version
echo "=== Docker Compose ===" && docker compose version
```

---

## 🚀 Desarrollo Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/devsebas22/EcommerceCaps.git
cd EcommerceCaps
```

### 2. Crear el Entorno Virtual

```bash
python3 -m venv .venv
source .venv/bin/activate       # Linux/Mac
# .venv\Scripts\activate        # Windows
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt      # Backend
cd frontend && npm install && cd ..  # Frontend
```

### 4. Configurar Variables de Entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# ── Backend ──
DATABASE_URL=postgresql://ecommerce_user:ecommerce123@127.0.0.1:5433/ecommerce_db
SECRET_KEY=genera_una_clave_con_openssl_rand_-hex_32
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
WOMPI_PRIVATE_KEY=prv_test_...
WOMPI_INTEGRITY_KEY=test_integrity_...
WOMPI_EVENTS_SECRET=
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@tudominio.com
FRONTEND_URL=http://localhost:5173
SENTRY_DSN=

# ── Frontend (VITE_*) ──
VITE_API_URL=http://127.0.0.1:8000/api
VITE_IMGBB_KEY=tu_key_de_imgbb
VITE_WOMPI_PUBLIC_KEY=pub_test_...
VITE_WHATSAPP_NUMBER=573154895642
VITE_INSTAGRAM_URL=
```

> **Nota:** `VITE_API_URL` apunta a `http://127.0.0.1:8000/api` en desarrollo y a `/api` en producción (mismo origen).

### 5. Levantar la Base de Datos

```bash
docker compose up -d
```

Esto inicia PostgreSQL en el puerto `5433`.

### 6. Ejecutar Migraciones

```bash
alembic upgrade head
```

### 7. Iniciar el Proyecto

```bash
# Opción 1 — Script rápido (inicia PostgreSQL, migraciones, backend y frontend)
chmod +x iniciar.sh && ./iniciar.sh

# Opción 2 — Manual
docker compose up -d postgres    # Solo BD
alembic upgrade head              # Migraciones
source .venv/bin/activate
uvicorn app.main:app --reload --env-file .env &   # Backend :8000
cd frontend && npm run dev                         # Frontend :5173
```

### 8. Abrir en el Navegador

| Servicio | URL |
|----------|-----|
| **Frontend** | [http://localhost:5173](http://localhost:5173) |
| **API Docs** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) |
| **Health** | [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) |

---

## 📁 Estructura del Proyecto

```
EcommerceCaps/
├── app/
│   ├── main.py              # Punto de entrada FastAPI
│   ├── database.py           # Configuración SQLAlchemy
│   ├── auth.py               # JWT + dependencias
│   ├── models/               # Modelos SQLAlchemy
│   │   ├── usuario.py
│   │   ├── producto.py
│   │   ├── categoria.py
│   │   ├── carrito.py
│   │   ├── pedido.py
│   │   └── password_reset.py
│   ├── routers/              # Endpoints de la API
│   │   ├── usuarios.py
│   │   ├── productos.py
│   │   ├── categorias.py
│   │   ├── carrito.py
│   │   ├── pedidos.py
│   │   ├── imagenes.py
│   │   ├── stats.py
│   │   ├── webhook.py        # Webhook Wompi
│   │   ├── firma.py          # Firma de integridad Wompi
│   │   └── auth_recovery.py  # Recuperación de contraseña
│   ├── schemas/              # Esquemas Pydantic
│   │   ├── usuario.py
│   │   ├── producto.py
│   │   ├── producto_imagen.py
│   │   ├── categoria.py
│   │   ├── carrito.py
│   │   └── pedido.py
│   └── tests/                # Tests automatizados
│       ├── conftest.py
│       ├── test_auth.py
│       ├── test_carrito.py
│       ├── test_categorias.py
│       ├── test_pedidos.py
│       ├── test_productos.py
│       └── test_usuarios.py
├── frontend/                 # Frontend React + Vite
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── pages/            # Catálogo, Carrito, Login, Perfil, etc.
│   │   ├── admin/            # Dashboard, Pedidos, Usuarios, Categorías
│   │   ├── components/       # ProductCard, ProductModal, Toast, etc.
│   │   ├── hooks/            # useCarrito
│   │   └── utils/            # api.js, wompi.js
│   └── vite.config.js
├── alembic/                  # Migraciones de base de datos
│   ├── env.py
│   └── versions/
├── .github/workflows/        # CI/CD pipelines
│   ├── ci.yml                # PR → lint + test
│   └── cd.yml                # Push a master → build + deploy
├── Dockerfile                # Multi-stage build (Node → Python)
├── entrypoint.sh             # Entrypoint del contenedor
├── docker-compose.yml        # PostgreSQL local
├── iniciar.sh                # Script de inicio rápido
├── alembic.ini
├── .env.example
├── pyproject.toml            # Ruff + pytest config
└── requirements.txt
```

---

## 🗄️ Base de Datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios con email, contraseña, rol admin y puntos de fidelidad |
| `categorias` | Categorías de productos (gorras, lociones, relojes) |
| `productos` | Productos con nombre, precio, marca, stock |
| `producto_imagenes` | Imágenes múltiples por producto |
| `carritos` | Carrito por usuario |
| `carrito_items` | Items dentro del carrito |
| `pedidos` | Pedidos con estado y dirección de envío |
| `pedido_items` | Items de cada pedido |
| `password_reset_tokens` | Tokens para recuperación de contraseña |

### Migraciones

```bash
# Crear una nueva migración
alembic revision --autogenerate -m "descripcion"

# Aplicar migraciones
alembic upgrade head

# Revertir última migración
alembic downgrade -1

# Ver estado
alembic current
```

---

## 🔗 Endpoints de la API

### Públicos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/usuarios/` | Registro de usuario |
| `POST` | `/api/usuarios/login` | Inicio de sesión |
| `GET` | `/api/productos/` | Listar productos (con paginación) |
| `GET` | `/api/productos/{id}` | Obtener producto |
| `GET` | `/api/categorias/` | Listar categorías |
| `POST` | `/api/auth/forgot-password` | Solicitar recuperación de contraseña |
| `POST` | `/api/auth/reset-password` | Restablecer contraseña |
| `POST` | `/api/webhook/wompi` | Webhook de confirmación de pago |

### Autenticados
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET/POST` | `/api/carrito/{usuario_id}` | Ver/agregar al carrito |
| `PUT` | `/api/carrito/{id}/item/{item_id}` | Actualizar cantidad |
| `DELETE` | `/api/carrito/{id}/item/{item_id}` | Eliminar item |
| `GET/PUT` | `/api/usuarios/{id}` | Obtener/actualizar perfil |
| `POST` | `/api/pedidos/{usuario_id}` | Crear pedido |
| `GET` | `/api/pedidos/historial/{usuario_id}` | Historial de pedidos |
| `PUT` | `/api/pedidos/{id}/estado` | Actualizar estado del pedido |
| `DELETE` | `/api/pedidos/{id}` | Cancelar pedido |
| `GET` | `/api/wompi/firma` | Obtener firma de integridad para Wompi |

### Administrador
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios/` | Listar todos los usuarios |
| `POST/PUT/DELETE` | `/api/productos/` | CRUD de productos |
| `POST/PUT/DELETE` | `/api/categorias/` | CRUD de categorías |
| `POST/DELETE` | `/api/imagenes/` | Gestión de imágenes |
| `GET` | `/api/pedidos/todos/` | Todos los pedidos |
| `GET` | `/api/stats/` | Estadísticas del dashboard |

> 📖 Documentación completa en Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🚀 Despliegue en Producción

El proyecto utiliza un pipeline de CI/CD completamente automatizado con **GitHub Actions**, **GitHub Container Registry (ghcr.io)** y **Render**.

### Arquitectura

```
[Push a master] → GitHub Actions
                    ├── 1. Lint + Test (backend & frontend)
                    ├── 2. Build Docker image (con VITE_* args)
                    ├── 3. Push a ghcr.io
                    ├── 4. Migraciones (alembic upgrade head) contra Supabase
                    └── 5. Disparar Deploy Hook → Render descarga imagen y sirve
```

### Requisitos en GitHub

Se requieren **5 secrets** en GitHub → Settings → Secrets and variables → Actions:

| Secret | Descripción |
|--------|-------------|
| `REGISTRY_PAT` | GitHub PAT con permiso `write:packages` |
| `DATABASE_URL` | Cadena de conexión a Supabase (`?sslmode=require`) |
| `VITE_IMGBB_KEY` | Clave pública de ImgBB |
| `VITE_WOMPI_PUBLIC_KEY` | Llave pública de Wompi |
| `RENDER_DEPLOY_HOOK_URL` | URL del Deploy Hook de Render |

### Configuración en Render

| Configuración | Valor |
|--------------|-------|
| **Source Type** | Container Registry |
| **Image** | `ghcr.io/devsebas22/ecommerce-caps:latest` |
| **Registry Credentials** | Usuario: `devsebas22` / Password: el mismo `REGISTRY_PAT` |
| **Auto-Deploy** | OFF (lo controla GitHub Actions) |

**Variables de entorno en Render:**

```
DATABASE_URL, SECRET_KEY, ALLOWED_ORIGINS,
WOMPI_PRIVATE_KEY, WOMPI_INTEGRITY_KEY, WOMPI_EVENTS_SECRET,
RESEND_API_KEY, RESEND_FROM_EMAIL, FRONTEND_URL,
SENTRY_DSN
```

### Flujo de CI/CD

1. Desarrollas en una rama (`feature/*`)
2. Abres un Pull Request a `master` → se ejecuta **CI** (lint + tests)
3. Al mergear a `master` → se ejecuta **CD**:
   - Backend: ruff lint + pytest
   - Frontend: build + vitest
   - Build de imagen Docker multi-stage
   - Push a ghcr.io
   - Migraciones automáticas contra Supabase
   - Deploy Hook a Render

---

## 🐳 Servicios Docker (Desarrollo Local)

| Servicio | Puerto | Credenciales |
|----------|--------|-------------|
| **PostgreSQL** | `5433` | `ecommerce_user` / `ecommerce123` |

```bash
docker compose up -d          # Iniciar
docker compose down           # Detener
docker compose down -v        # Detener y borrar volúmenes
```

---

## 🧪 Tests

```bash
# Backend (requiere PostgreSQL corriendo)
pytest --cov=app/ -v

# Frontend
cd frontend && npx vitest run
```

---

## 👥 Autores

<div align="center">

| |
|---|
| **👤 Juan Esteban Aguirre Foronda** |
| **👤 Sebastián Mogollón Mendoza** |

</div>

> Desarrollado como proyecto universitario — Entornos de Desarrollo.
> © 2026 EcommerceCaps — Todos los derechos reservados.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

⭐️ Si te gusta este proyecto, ¡dale una estrella en [GitHub](https://github.com/devsebas22/EcommerceCaps)!

</div>
