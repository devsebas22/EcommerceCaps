from app.auth import crear_token


def test_token_invalido(client, usuario):
    response = client.get(f"/api/usuarios/{usuario.id}", headers={
        "Authorization": "Bearer token_falso_invalido"
    })
    assert response.status_code == 401


def test_sin_token(client, usuario):
    response = client.get(f"/api/usuarios/{usuario.id}")
    assert response.status_code == 401


def test_admin_requerido(client, usuario_token):
    response = client.get("/api/usuarios/", headers=usuario_token)
    assert response.status_code == 403


def test_admin_requerido_categoria(client, usuario_token):
    response = client.post("/api/categorias/", json={
        "nombre": "Test",
    }, headers=usuario_token)
    assert response.status_code == 403


def test_admin_requerido_producto(client, usuario_token):
    response = client.post("/api/productos/", json={
        "nombre": "Test",
        "precio": 10,
        "marca": "M",
        "stock": 5,
        "categoria_id": 1,
    }, headers=usuario_token)
    assert response.status_code == 403


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_crear_token_valido():
    token = crear_token({"usuario_id": 1, "es_admin": True, "email": "admin@test.com"})
    assert isinstance(token, str)
    assert len(token.split(".")) == 3
