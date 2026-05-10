import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

const imgPrincipal = (p) =>
  p.imagenes?.find((i) => i.es_principal)?.url ?? p.imagenes?.[0]?.url ?? null;

export default function Catalogo({ usuario, onCarritoChange, esAdmin = false }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sel, setSel] = useState(null);
  const [agregando, setAgregando] = useState(false);
  const [agregadoId, setAgregadoId] = useState(null); // id del producto recién agregado
  const [modalProducto, setModalProducto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "", descripcion: "", precio: "", marca: "", stock: "", imagen_url: "", categoria_id: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    let ok = true;
    fetch(`${API_BASE}/productos/`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { if (ok) setProductos(d); })
      .catch((e) => { if (ok) setError(e.message); })
      .finally(() => ok && setCargando(false));
    return () => (ok = false);
  }, []);

  const agregarAlCarrito = async (producto) => {
    if (!usuario) { navigate("/login"); return; }
    setAgregando(true);
    try {
      await fetch(`${API_BASE}/carrito/${usuario.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: producto.id, cantidad: 1 }),
      });
      setAgregadoId(producto.id);
      onCarritoChange?.();
      setTimeout(() => setAgregadoId(null), 2000);
    } finally {
      setAgregando(false);
    }
  };

  if (cargando) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", gap: "16px" }}>
      <Spinner animation="grow" style={{ color: "var(--gold)", width: "2.2rem", height: "2.2rem" }} />
      <span style={{ color: "var(--t2)", fontSize: "0.82rem", letterSpacing: "0.5px" }}>Cargando colección…</span>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--err)", fontSize: "0.9rem" }}>
      Error al cargar productos: {error}
    </div>
  );
  const cargarCategorias = async () => {
  const res = await fetch(`${API_BASE}/categorias/`);
  const data = await res.json();
  setCategorias(data);
};

const abrirEditar = (producto) => {
  setForm({
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precio: producto.precio,
    marca: producto.marca,
    stock: producto.stock,
    imagen_url: producto.imagen_url || "",
    categoria_id: producto.categoria_id
  });
  setProductoEditando(producto);
  setModalProducto(true);
  cargarCategorias();
};

const abrirNuevo = () => {
  setForm({ nombre: "", descripcion: "", precio: "", marca: "", stock: "", imagen_url: "", categoria_id: "" });
  setProductoEditando(null);
  setModalProducto(true);
  cargarCategorias();
};

const eliminarProducto = async (id) => {
  if (!confirm("¿Eliminar este producto?")) return;
  await fetch(`${API_BASE}/productos/${id}`, { method: "DELETE" });
  setProductos(productos.filter(p => p.id !== id));
};

const handleSubmitProducto = async (e) => {
  e.preventDefault();
  const body = {
    ...form,
    precio: parseFloat(form.precio),
    stock: parseInt(form.stock),
    categoria_id: parseInt(form.categoria_id)
  };
  const url = productoEditando
    ? `${API_BASE}/productos/${productoEditando.id}`
    : `${API_BASE}/productos/`;
  const method = productoEditando ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const data = await res.json();
    if (productoEditando) {
      setProductos(productos.map(p => p.id === data.id ? data : p));
    } else {
      setProductos([...productos, data]);
    }
    setModalProducto(false);
  }
};


  const selImg = sel ? imgPrincipal(sel) : null;

  return (
    <>
      {/* Encabezado */}
      <div style={{ marginBottom: "44px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--t2)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", margin: "0 0 6px" }}>
            Colección actual
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>
            Nuestros Productos
          </h2>
          <div className="heading-line" />
        </div>
        {esAdmin && (
          <Button className="btn-theme-primary" onClick={abrirNuevo}>
            + Nuevo Producto
          </Button>
        )}
      </div>

      {/* Grid */}
      {productos.length === 0 ? (
        <p style={{ color: "var(--t2)", textAlign: "center", paddingTop: "60px" }}>
          No hay productos disponibles.
        </p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {productos.map((p) => {
            const img = imgPrincipal(p);
            const yaAgregado = agregadoId === p.id;
            return (
              <Col key={p.id}>
                <Card className="h-100 card-product">
                  {/* Imagen — clickeable para ver detalles */}
                  <div
                    style={{ height: "215px", background: "var(--bg-1)", overflow: "hidden", position: "relative", cursor: "pointer" }}
                    onClick={() => setSel(p)}
                  >
                    {img
                      ? <img src={img} alt={p.nombre} className="prod-img" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s var(--ease)" }} />
                      : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--t3)", fontSize: "0.7rem", letterSpacing: "1px" }}>SIN IMAGEN</div>
                    }
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "56px", background: "linear-gradient(transparent, var(--bg-2))", pointerEvents: "none" }} />
                  </div>

                  {/* Body */}
                  <Card.Body style={{ display: "flex", flexDirection: "column", padding: "18px 20px" }}>
                    <span className="badge-cat" style={{ marginBottom: "10px", cursor: "pointer" }} onClick={() => setSel(p)}>
                      {p.categoria?.nombre ?? "Colección"}
                    </span>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--t1)", margin: "0 0 2px", lineHeight: 1.3, cursor: "pointer" }} onClick={() => setSel(p)}>
                      {p.nombre}
                    </p>
                    {p.marca && (
                      <p style={{ fontSize: "0.76rem", color: "var(--t2)", margin: 0 }}>{p.marca}</p>
                    )}

                    <div style={{ marginTop: "auto", paddingTop: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ color: "var(--t3)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.6px" }}>Precio</span>
                        <span className="text-gold" style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                          ${p.precio.toLocaleString()}
                        </span>
                      </div>

                      {/* Dos botones: detalles + agregar */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                          variant="outline-secondary"
                          style={{ flex: "0 0 auto", borderRadius: "var(--r2)", borderColor: "var(--border-md)", color: "var(--t2)", fontSize: "0.8rem", padding: "8px 12px" }}
                          onClick={() => setSel(p)}
                        >
                          Ver
                        </Button>
                        {esAdmin ? (
                          <>
                            <Button
                              variant="outline-warning"
                              style={{ flex: "1", borderRadius: "var(--r2)", fontSize: "0.8rem", padding: "8px" }}
                              onClick={() => abrirEditar(p)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="outline-danger"
                              style={{ flex: "0 0 auto", borderRadius: "var(--r2)", fontSize: "0.8rem", padding: "8px 12px" }}
                              onClick={() => eliminarProducto(p.id)}
                            >
                              ✕
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="btn-theme-primary flex-fill"
                            style={{ padding: "8px", fontSize: "0.82rem" }}
                            onClick={() => agregarAlCarrito(p)}
                            disabled={agregando}
                          >
                            {yaAgregado ? "✓ Agregado" : "+ Carrito"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* ── Modal de detalle ── */}
      <Modal
        show={!!sel}
        onHide={() => setSel(null)}
        centered
        size="lg"
        contentClassName="modal-product-c"
        className="modal-product"
      >
        {sel && (
          <>
            <Modal.Body>
              {/* Imagen edge-to-edge */}
              {selImg && (
                <div style={{ height: "280px", overflow: "hidden" }}>
                  <img
                    src={selImg}
                    alt={sel.nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              )}

              {/* Detalles */}
              <div style={{ padding: "26px 28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span className="badge-cat">{sel.categoria?.nombre}</span>
                    <h4 style={{ color: "var(--t1)", fontWeight: 800, margin: "10px 0 2px", fontSize: "1.2rem" }}>
                      {sel.nombre}
                    </h4>
                    {sel.marca && (
                      <p style={{ color: "var(--t2)", fontSize: "0.84rem", margin: 0 }}>{sel.marca}</p>
                    )}
                  </div>
                  <span className="text-gold" style={{ fontWeight: 800, fontSize: "1.9rem", lineHeight: 1 }}>
                    ${sel.precio.toLocaleString()}
                  </span>
                </div>

                <hr style={{ borderColor: "var(--border)", margin: "20px 0" }} />

                {sel.descripcion && (
                  <p style={{ color: "var(--t2)", fontSize: "0.88rem", lineHeight: 1.75, margin: "0 0 18px" }}>
                    {sel.descripcion}
                  </p>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="label-theme" style={{ margin: 0 }}>Stock:</span>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: sel.stock > 5 ? "var(--ok)" : sel.stock > 0 ? "var(--warn)" : "var(--err)" }}>
                    {sel.stock > 0 ? `${sel.stock} unidades disponibles` : "Sin stock"}
                  </span>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer style={{ background: "var(--bg-3)", borderTop: "1px solid var(--border)", padding: "16px 28px", gap: "12px" }}>
              <Button
                className="btn-theme-primary flex-fill"
                style={{ padding: "12px" }}
                onClick={() => { agregarAlCarrito(sel); setSel(null); }}
                disabled={sel.stock === 0}
              >
                {sel.stock === 0 ? "Sin stock" : "+ Agregar al carrito"}
              </Button>
              <Button
                variant="link"
                style={{ color: "var(--t2)", textDecoration: "none", fontSize: "0.87rem", padding: "12px 6px" }}
                onClick={() => setSel(null)}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
          <Modal show={modalProducto} onHide={() => setModalProducto(false)} centered className="modal-admin">
      <Modal.Header closeButton>
        <Modal.Title>{productoEditando ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitProducto}>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Nombre</Form.Label>
            <Form.Control className="input-theme" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Descripción</Form.Label>
            <Form.Control className="input-theme" as="textarea" rows={2} value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} />
          </Form.Group>
          <div className="d-flex gap-3">
            <Form.Group className="mb-3 flex-fill">
              <Form.Label className="label-theme">Precio</Form.Label>
              <Form.Control className="input-theme" type="number" value={form.precio} onChange={(e) => setForm({...form, precio: e.target.value})} required />
            </Form.Group>
            <Form.Group className="mb-3 flex-fill">
              <Form.Label className="label-theme">Stock</Form.Label>
              <Form.Control className="input-theme" type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} required />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Marca</Form.Label>
            <Form.Control className="input-theme" value={form.marca} onChange={(e) => setForm({...form, marca: e.target.value})} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Categoría</Form.Label>
            <Form.Select className="input-theme" value={form.categoria_id} onChange={(e) => setForm({...form, categoria_id: e.target.value})} required>
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="label-theme">URL Imagen (opcional)</Form.Label>
            <Form.Control className="input-theme" value={form.imagen_url} onChange={(e) => setForm({...form, imagen_url: e.target.value})} placeholder="https://i.ibb.co/..." />
          </Form.Group>
          <div className="d-grid">
            <Button type="submit" className="btn-theme-primary">
              {productoEditando ? "Actualizar Producto" : "Crear Producto"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
      <style>{`
        .modal-product-c {
          background: var(--bg-3) !important;
          border: 1px solid rgba(255,255,255,.12) !important;
          border-radius: 22px !important;
          overflow: hidden !important;
          box-shadow: 0 20px 60px rgba(0,0,0,.70) !important;
        }
        .modal-product .modal-body  { padding: 0 !important; background: var(--bg-3) !important; }
        .modal-product .modal-footer { background: var(--bg-3) !important; border-top: 1px solid var(--border) !important; }
      `}</style>
    </>
  );
}
