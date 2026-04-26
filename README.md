# 🛒 EcommerceCaps

> Plataforma de e-commerce dedicada a la venta de gorras, lociones y relojes.

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136.0-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Descripción del Proyecto

EcommerceCaps es una API RESTful desarrollada con **FastAPI** que proporciona la infraestructura necesaria para una tienda en línea de accesorios (gorras, lociones y relojes). El proyecto incluye gestión de usuarios, productos, categorías, carrito de compras y pedidos.

### ✨ Características Principales

- 🔐 **Autenticación segura** con JWT y hashing de contraseñas
- 👥 **Gestión de usuarios** con roles y puntos de fidelidad
- 📦 **Gestión de productos** con categorías, marcas y stock
- 🛒 **Carrito de compras** persistente por usuario
- 📋 **Sistema de pedidos** completo con estados
- 🐘 **Base de datos PostgreSQL** con Docker
- 📚 **Documentación interactiva** con Swagger UI
- 🔄 **Scripts SQL** para inicialización y datos de prueba

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|-----------|-------------|
| **Backend** | FastAPI (Python 3.12+) |
| **Base de datos** | PostgreSQL 16 |
| **ORM** | SQLAlchemy 2.0 |
| **Contenedores** | Docker + Docker Compose |
| **Admin DB** | pgAdmin 4 |
| **Servidor** | Uvicorn |

---

## 📋 Requisitos Previos

- Python 3.12 o superior
- Docker Desktop
- WSL2 (Ubuntu 24.04) - *Para Windows*

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/devsebas22/EcommerceCaps.git
cd EcommerceCaps/proyectoFinal
```

### 2. Crear el Entorno Virtual

```bash
python3 -m venv venv
source venv/bin/activate    # Linux/Mac
# venv\Scripts\activate     # Windows
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://ecommerce_user:ecommerce123@127.0.0.1:5433/ecommerce_db
```

### 5. Levantar la Base de Datos

```bash
docker compose up -d
```

### 6. Inicializar la Base de Datos

```bash
# Ejecutar script de creación de tablas
docker exec -i ecommerce-db psql -U ecommerce_user -d ecommerce_db < create_tables.sql

# (Opcional) Cargar datos de ejemplo
docker exec -i ecommerce-db psql -U ecommerce_user -d ecommerce_db < seed.sql
```

### 7. Arrancar el Servidor

```bash
uvicorn app.main:app --reload --env-file .env
```

### 8. Acceder a la Documentación

Abre en tu navegador: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## 📁 Estructura del Proyecto

```
proyectoFinal/
├── app/
│   ├── __init__.py         # Inicialización de la app
│   ├── database.py         # Configuración de base de datos
│   ├── main.py             # Punto de entrada de FastAPI
│   ├── models/             # Modelos SQLAlchemy
│   │   ├── usuario.py
│   │   ├── producto.py
│   │   ├── categoria.py
│   │   ├── carrito.py
│   │   └── pedido.py
│   ├── routers/            # Endpoints de la API
│   │   ├── usuarios.py
│   │   ├── productos.py
│   │   ├── categorias.py
│   │   ├── carrito.py
│   │   └── pedidos.py
│   └── schemas/            # Esquemas Pydantic
│       ├── usuario.py
│       ├── producto.py
│       ├── categoria.py
│       ├── carrito.py
│       └── pedido.py
├── create_tables.sql       # Script de creación de tablas
├── seed.sql                # Datos de ejemplo iniciales
├── docker-compose.yml      # Configuración de contenedores
├── requirements.txt        # Dependencias Python
└── .env                    # Variables de entorno
```

---

## 🗄️ Esquema de Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Usuarios con email, password, dirección, teléfono, rol admin y puntos de fidelidad |
| `categorias` | Categorías de productos (gorras, lociones, relojes) |
| `productos` | Productos con nombre, descripción, precio, marca, stock e imagen |
| `carritos` | Carritos asociados a usuarios |
| `carrito_items` | Items dentro del carrito (relación carrito-producto) |
| `pedidos` | Pedidos con estado, total y dirección de envío |
| `pedido_items` | Items de cada pedido |

### Datos de Ejemplo (seed.sql)

El proyecto incluye datos iniciales para probar:
- **3 categorías:** gorras, lociones, relojes
- **5 productos:** Gorras Nike, Loción Armani, Reloj Casio, Loción Gucci, Gorra Puma BMW

---

## 🔗 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/usuarios/` | Crear usuario |
| `POST` | `/usuarios/login` | Iniciar sesión |
| `GET` | `/productos/` | Listar productos |
| `POST` | `/productos/` | Crear producto |
| `GET` | `/categorias/` | Listar categorías |
| `POST` | `/carrito/` | Agregar al carrito |
| `GET` | `/carrito/{usuario_id}` | Ver carrito |
| `POST` | `/pedidos/` | Crear pedido |
| `GET` | `/pedidos/{usuario_id}` | Ver pedidos |

> 📖 Documentación completa disponible en **Swagger UI**

---

## 🐳 Servicios Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **PostgreSQL** | `5433` | Base de datos |
| **pgAdmin** | `5050` | Admin de DB (admin@admin.com / admin123) |

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 👥 Autores

<div align="center">

| |
|---|
| **Juan Esteban Aguirre Foronda** |
| **Sebastian Mogollón Mendoza** |

</div>
> © 2026 EcommerceCaps - Todos los derechos reservados---

## �📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

⭐️ Si te gusta este proyecto, ¡dale una estrella!

</div>