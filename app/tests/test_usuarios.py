def test_crear_usuario(client):
    response = client.post("/api/usuarios/", json={
        "nombre": "Nuevo Usuario",
        "email": "nuevo@example.com",
        "password": "password123",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "nuevo@example.com"
    assert data["nombre"] == "Nuevo Usuario"
    assert "id" in data
    assert data["es_admin"] is False


def test_email_duplicado(client, usuario):
    response = client.post("/api/usuarios/", json={
        "nombre": "Otro",
        "email": "test@example.com",
        "password": "password123",
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "El email ya está registrado"


def test_login_exitoso(client, usuario):
    response = client.post("/api/usuarios/login", json={
        "email": "test@example.com",
        "password": "password123",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["email"] == "test@example.com"
    assert data["mensaje"] == "Login exitoso"


def test_login_email_incorrecto(client, usuario):
    response = client.post("/api/usuarios/login", json={
        "email": "noexiste@example.com",
        "password": "password123",
    })
    assert response.status_code == 404


def test_login_password_incorrecto(client, usuario):
    response = client.post("/api/usuarios/login", json={
        "email": "test@example.com",
        "password": "wrongpassword",
    })
    assert response.status_code == 400


def test_obtener_usuario_propio(client, usuario_token, usuario):
    response = client.get(f"/api/usuarios/{usuario.id}", headers=usuario_token)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == usuario.email


def test_obtener_usuario_no_autorizado(client, usuario_token, admin):
    response = client.get(f"/api/usuarios/{admin.id}", headers=usuario_token)
    assert response.status_code == 403


def test_obtener_usuario_sin_token(client, usuario):
    response = client.get(f"/api/usuarios/{usuario.id}")
    assert response.status_code == 401


def test_listar_usuarios_admin(client, admin_token):
    response = client.get("/api/usuarios/", headers=admin_token)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_listar_usuarios_no_admin(client, usuario_token):
    response = client.get("/api/usuarios/", headers=usuario_token)
    assert response.status_code == 403


def test_actualizar_usuario(client, usuario_token, usuario):
    response = client.put(f"/api/usuarios/{usuario.id}", json={
        "nombre": "Nombre Actualizado",
        "email": "actualizado@example.com",
    }, headers=usuario_token)
    assert response.status_code == 200
    assert response.json()["nombre"] == "Nombre Actualizado"


def test_eliminar_usuario_admin(client, admin_token, usuario):
    response = client.delete(f"/api/usuarios/{usuario.id}", headers=admin_token)
    assert response.status_code == 200
