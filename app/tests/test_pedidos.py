from app.models.categoria import Categoria
from app.models.producto import Producto
from app.models.carrito import Carrito, CarritoItem
from app.models.pedido import Pedido, EstadoPedido


def _setup_carrito_con_item(db_session, usuario):
    cat = Categoria(nombre="CatPedido", descripcion="D")
    db_session.add(cat)
    db_session.commit()
    prod = Producto(nombre="ProdPedido", precio=100, marca="M", stock=10, categoria_id=cat.id)
    db_session.add(prod)
    db_session.commit()
    carrito = Carrito(usuario_id=usuario.id)
    db_session.add(carrito)
    db_session.commit()
    item = CarritoItem(carrito_id=carrito.id, producto_id=prod.id, cantidad=2)
    db_session.add(item)
    db_session.commit()
    return prod


def test_crear_pedido(client, usuario_token, usuario, db_session):
    _setup_carrito_con_item(db_session, usuario)
    response = client.post(f"/api/pedidos/{usuario.id}", json={
        "direccion_envio": "Calle 123, Ciudad",
    }, headers=usuario_token)
    assert response.status_code == 200
    data = response.json()
    assert float(data["total"]) == 200.0
    assert data["direccion_envio"] == "Calle 123, Ciudad"
    assert data["usuario_id"] == usuario.id


def test_crear_pedido_carrito_vacio(client, usuario_token, usuario):
    response = client.post(f"/api/pedidos/{usuario.id}", json={
        "direccion_envio": "Calle 123",
    }, headers=usuario_token)
    assert response.status_code == 400
    assert "vacío" in response.json()["detail"].lower()


def test_crear_pedido_sin_autenticacion(client, usuario):
    response = client.post(f"/api/pedidos/{usuario.id}", json={
        "direccion_envio": "Calle 123",
    })
    assert response.status_code == 401


def test_historial_pedidos(client, usuario_token, usuario, db_session):
    _setup_carrito_con_item(db_session, usuario)
    client.post(f"/api/pedidos/{usuario.id}", json={
        "direccion_envio": "Calle 123",
    }, headers=usuario_token)

    response = client.get(f"/api/pedidos/historial/{usuario.id}", headers=usuario_token)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


def test_listar_todos_pedidos_admin(client, admin_token, usuario_token, usuario, db_session):
    _setup_carrito_con_item(db_session, usuario)
    client.post(f"/api/pedidos/{usuario.id}", json={
        "direccion_envio": "Calle 123",
    }, headers=usuario_token)

    response = client.get("/api/pedidos/todos/", headers=admin_token)
    assert response.status_code == 200


def test_actualizar_estado_pedido(client, usuario_token, usuario, admin_token, db_session):
    _setup_carrito_con_item(db_session, usuario)
    pedido_resp = client.post(f"/api/pedidos/{usuario.id}", json={
        "direccion_envio": "Calle 123",
    }, headers=usuario_token)
    pedido_id = pedido_resp.json()["id"]

    response = client.put(f"/api/pedidos/{pedido_id}/estado", json={
        "estado": "pagado",
    }, headers=usuario_token)
    assert response.status_code == 200
    assert response.json()["estado"] == "pagado"


def test_cancelar_pedido_propio(client, usuario_token, usuario, db_session):
    _setup_carrito_con_item(db_session, usuario)
    pedido_resp = client.post(f"/api/pedidos/{usuario.id}", json={
        "direccion_envio": "Calle 123",
    }, headers=usuario_token)
    pedido_id = pedido_resp.json()["id"]

    response = client.delete(f"/api/pedidos/{pedido_id}", headers=usuario_token)
    assert response.status_code == 200
