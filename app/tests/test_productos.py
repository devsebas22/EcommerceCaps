def _crear_categoria(db_session):
    from app.models.categoria import Categoria
    cat = Categoria(nombre="Categoria Test", descripcion="Desc")
    db_session.add(cat)
    db_session.commit()
    return cat


def test_crear_producto(client, admin_token, db_session):
    cat = _crear_categoria(db_session)
    response = client.post("/api/productos/", json={
        "nombre": "Producto Test",
        "precio": 99.99,
        "marca": "Marca Test",
        "stock": 10,
        "categoria_id": cat.id,
    }, headers=admin_token)
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Producto Test"
    assert float(data["precio"]) == 99.99
    assert "id" in data


def test_crear_producto_sin_admin(client, usuario_token, db_session):
    cat = _crear_categoria(db_session)
    response = client.post("/api/productos/", json={
        "nombre": "Producto",
        "precio": 50,
        "marca": "Marca",
        "stock": 5,
        "categoria_id": cat.id,
    }, headers=usuario_token)
    assert response.status_code == 403


def test_crear_producto_stock_negativo(client, admin_token, db_session):
    cat = _crear_categoria(db_session)
    response = client.post("/api/productos/", json={
        "nombre": "Stock Negativo",
        "precio": 10,
        "marca": "Marca",
        "stock": -1,
        "categoria_id": cat.id,
    }, headers=admin_token)
    assert response.status_code == 400


def test_listar_productos(client, db_session):
    from app.models.categoria import Categoria
    from app.models.producto import Producto
    cat = Categoria(nombre="Cat", descripcion="D")
    db_session.add(cat)
    db_session.commit()
    db_session.add(Producto(nombre="P1", precio=10, marca="M", stock=5, categoria_id=cat.id))
    db_session.add(Producto(nombre="P2", precio=20, marca="M", stock=3, categoria_id=cat.id))
    db_session.commit()

    response = client.get("/api/productos/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_obtener_producto(client, db_session):
    from app.models.categoria import Categoria
    from app.models.producto import Producto
    cat = Categoria(nombre="CatX", descripcion="D")
    db_session.add(cat)
    db_session.commit()
    prod = Producto(nombre="Unico", precio=15, marca="M", stock=2, categoria_id=cat.id)
    db_session.add(prod)
    db_session.commit()

    response = client.get(f"/api/productos/{prod.id}")
    assert response.status_code == 200
    assert response.json()["nombre"] == "Unico"


def test_producto_no_encontrado(client):
    response = client.get("/api/productos/99999")
    assert response.status_code == 404


def test_actualizar_producto(client, admin_token, db_session):
    from app.models.categoria import Categoria
    from app.models.producto import Producto
    cat = Categoria(nombre="CatY", descripcion="D")
    db_session.add(cat)
    db_session.commit()
    prod = Producto(nombre="Original", precio=10, marca="M", stock=5, categoria_id=cat.id)
    db_session.add(prod)
    db_session.commit()

    response = client.put(f"/api/productos/{prod.id}", json={
        "nombre": "Actualizado",
        "precio": 25,
        "marca": "NuevaMarca",
        "stock": 8,
        "categoria_id": cat.id,
    }, headers=admin_token)
    assert response.status_code == 200
    assert response.json()["nombre"] == "Actualizado"


def test_eliminar_producto(client, admin_token, db_session):
    from app.models.categoria import Categoria
    from app.models.producto import Producto
    cat = Categoria(nombre="CatZ", descripcion="D")
    db_session.add(cat)
    db_session.commit()
    prod = Producto(nombre="Eliminar", precio=10, marca="M", stock=5, categoria_id=cat.id)
    db_session.add(prod)
    db_session.commit()

    response = client.delete(f"/api/productos/{prod.id}", headers=admin_token)
    assert response.status_code == 200
