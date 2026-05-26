def test_crear_categoria(client, admin_token):
    response = client.post("/api/categorias/", json={
        "nombre": "Gorras",
        "descripcion": "Todo tipo de gorras",
    }, headers=admin_token)
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Gorras"
    assert "id" in data


def test_crear_categoria_sin_admin(client, usuario_token):
    response = client.post("/api/categorias/", json={
        "nombre": "Gorras",
    }, headers=usuario_token)
    assert response.status_code == 403


def test_listar_categorias(client, admin_token, db_session):
    from app.models.categoria import Categoria
    db_session.add(Categoria(nombre="Cat1", descripcion="D1"))
    db_session.add(Categoria(nombre="Cat2", descripcion="D2"))
    db_session.commit()

    response = client.get("/api/categorias/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_obtener_categoria(client, admin_token, db_session):
    from app.models.categoria import Categoria
    cat = Categoria(nombre="Test", descripcion="Test desc")
    db_session.add(cat)
    db_session.commit()

    response = client.get(f"/api/categorias/{cat.id}", headers=admin_token)
    assert response.status_code == 200
    assert response.json()["nombre"] == "Test"


def test_actualizar_categoria(client, admin_token, db_session):
    from app.models.categoria import Categoria
    cat = Categoria(nombre="Original", descripcion="Original")
    db_session.add(cat)
    db_session.commit()

    response = client.put(f"/api/categorias/{cat.id}", json={
        "nombre": "Actualizada",
        "descripcion": "Nueva desc",
    }, headers=admin_token)
    assert response.status_code == 200
    assert response.json()["nombre"] == "Actualizada"


def test_eliminar_categoria_sin_productos(client, admin_token, db_session):
    from app.models.categoria import Categoria
    cat = Categoria(nombre="ParaEliminar", descripcion="Sola")
    db_session.add(cat)
    db_session.commit()

    response = client.delete(f"/api/categorias/{cat.id}", headers=admin_token)
    assert response.status_code == 200


def test_eliminar_categoria_con_productos(client, admin_token, db_session):
    from app.models.categoria import Categoria
    from app.models.producto import Producto
    cat = Categoria(nombre="ConProductos", descripcion="Tiene hijos")
    db_session.add(cat)
    db_session.commit()
    db_session.add(Producto(nombre="P", precio=10, marca="M", stock=5, categoria_id=cat.id))
    db_session.commit()

    response = client.delete(f"/api/categorias/{cat.id}", headers=admin_token)
    assert response.status_code == 400
