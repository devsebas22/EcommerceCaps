import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

from app.database import Base, get_db
from app.main import app
from app.models.usuario import Usuario
from app.auth import crear_token

DATABASE_URL = os.getenv("DATABASE_URL")

@pytest.fixture(scope="session")
def engine():
    eng = create_engine(DATABASE_URL, pool_pre_ping=True)
    Base.metadata.create_all(bind=eng)
    yield eng
    Base.metadata.drop_all(bind=eng)

@pytest.fixture(autouse=True)
def clean_db(engine):
    with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())

@pytest.fixture
def db_session(engine):
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

@pytest.fixture
def client(db_session):
    def _get_db():
        yield db_session
    app.dependency_overrides[get_db] = _get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def pwd_ctx():
    return CryptContext(schemes=["bcrypt"], deprecated="auto")

@pytest.fixture
def usuario(db_session, pwd_ctx):
    user = Usuario(
        nombre="Test User",
        email="test@example.com",
        password=pwd_ctx.hash("password123"),
        es_admin=False,
    )
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def admin(db_session, pwd_ctx):
    user = Usuario(
        nombre="Admin User",
        email="admin@example.com",
        password=pwd_ctx.hash("admin123"),
        es_admin=True,
    )
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def usuario_token(usuario):
    token = crear_token({
        "usuario_id": usuario.id,
        "es_admin": False,
        "email": usuario.email,
    })
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_token(admin):
    token = crear_token({
        "usuario_id": admin.id,
        "es_admin": True,
        "email": admin.email,
    })
    return {"Authorization": f"Bearer {token}"}
