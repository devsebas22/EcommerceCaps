from app.models.categoria import Categoria
from app.models.producto import Producto


def _setup_producto(db_session):
    cat = Categoria(nombre="CatCarrito", descripcion="D")
    db_session.add(cat)
    db_session.commit()
    prod = Producto(nombre="ProdCarrito", precio=50, marca="M", stock=10, categoria_id=cat.id)
    db_session.add(prod)
    db_session.commit()
    return prod


def test_agregar_item(client, usuario_token, usuario, db_session):
    prod = _setup_producto(db_session)
    response = client.post(f"/api/carrito/{usuario.id}", json={
        "producto_id": prod.id,
        "cantidad": 2,
    }, headers=usuario_token)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["cantidad"] == 2


def test_agregar_item_sin_autenticacion(client, usuario, db_session):
    prod = _setup_producto(db_session)
    response = client.post(f"/api/carrito/{usuario.id}", json={
        "producto_id": prod.id,
        "cantidad": 1,
    })
    assert response.status_code == 401


def test_agregar_producto_inexistente(client, usuario_token, usuario):
    response = client.post(f"/api/carrito/{usuario.id}", json={
        "producto_id": 99999,
        "cantidad": 1,
    }, headers=usuario_token)
    assert response.status_code == 404


def test_agregar_item_stock_insuficiente(client, usuario_token, usuario, db_session):
    prod = _setup_producto(db_session)
    response = client.post(f"/api/carrito/{usuario.id}", json={
        "producto_id": prod.id,
        "cantidad": 999,
    }, headers=usuario_token)
    assert response.status_code == 400


def test_obtener_carrito(client, usuario_token, usuario, db_session):
    prod = _setup_producto(db_session)
    client.post(f"/api/carrito/{usuario.id}", json={
        "producto_id": prod.id,
        "cantidad": 3,
    }, headers=usuario_token)

    response = client.get(f"/api/carrito/{usuario.id}", headers=usuario_token)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["cantidad"] == 3


def test_actualizar_cantidad(client, usuario_token, usuario, db_session):
    prod = _setup_producto(db_session)
    client.post(f"/api/carrito/{usuario.id}", json={
        "producto_id": prod.id,
        "cantidad": 1,
    }, headers=usuario_token)

    carrito = client.get(f"/api/carrito/{usuario.id}", headers=usuario_token).json()
    item_id = carrito["items"][0]["id"]

    response = client.put(f"/api/carrito/{usuario.id}/item/{item_id}", json={
        "producto_id": prod.id,
        "cantidad": 5,
    }, headers=usuario_token)
    assert response.status_code == 200


def test_eliminar_item(client, usuario_token, usuario, db_session):
    prod = _setup_producto(db_session)
    client.post(f"/api/carrito/{usuario.id}", json={
        "producto_id": prod.id,
        "cantidad": 1,
    }, headers=usuario_token)

    carrito = client.get(f"/api/carrito/{usuario.id}", headers=usuario_token).json()
    item_id = carrito["items"][0]["id"]

    response = client.delete(f"/api/carrito/{usuario.id}/item/{item_id}", headers=usuario_token)
    assert response.status_code == 200
