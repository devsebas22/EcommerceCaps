import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Button, Container, Modal } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/productos/`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        if (mounted) setProductos(data);
      })
      .catch((err) => { if (mounted) setError(err.message); })
      .finally(() => mounted && setCargando(false));
    return () => (mounted = false);
  }, []);

  if (cargando) return (
    <div className="d-flex flex-column justify-content-center align-items-center my-5 py-5">
      <Spinner animation="grow" style={{ color: 'var(--accent-cyan)' }} />
      <p className="mt-3 text-muted fw-light">Sincronizando inventario...</p>
    </div>
  );

  return (
    <Container className="pb-5">
      <div className="mb-5">
        <h2 className="fw-bold text-white text-uppercase" style={{ letterSpacing: '1px' }}>Nuestros Productos</h2>
        <div style={{ width: "60px", height: "4px", backgroundColor: "var(--accent-cyan)" }}></div>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {productos.map((p) => (
          <Col key={p.id}>
            <Card className="h-100 card-theme border-0 overflow-hidden shadow-sm">
              <div style={{ height: '200px', backgroundColor: '#08090a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                   {p.imagenes && p.imagenes.length > 0 ? (
                  <img
                  src={p.imagenes.find(img => img.es_principal)?.url || p.imagenes[0].url}
                  alt={p.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span className="text-muted small">SIN IMAGEN</span>
              )}
            </div>
              <Card.Body className="d-flex flex-column p-4">
                <span className="label-theme mb-2 small fw-bold">
                  {p.categoria?.nombre || "COLECCIÓN"}
                </span>
                <Card.Title className="fw-bold mb-3 text-white">{p.nombre}</Card.Title>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small text-uppercase">Precio</span>
                    <span className="fs-5 fw-bold text-cyan">${p.precio}</span>
                  </div>
                  <Button
                    className="btn-theme-primary w-100 py-2 fw-bold text-uppercase"
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => setProductoSeleccionado(p)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de detalles */}
      <Modal show={!!productoSeleccionado} onHide={() => setProductoSeleccionado(null)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#1a1d24', borderColor: '#24272e' }}>
          <Modal.Title style={{ color: '#eef0f2' }}>{productoSeleccionado?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#1a1d24', color: '#eef0f2' }}>
          <p><span className="label-theme">Categoría:</span> {productoSeleccionado?.categoria?.nombre}</p>
          <p><span className="label-theme">Marca:</span> {productoSeleccionado?.marca}</p>
          <p><span className="label-theme">Descripción:</span> {productoSeleccionado?.descripcion || "Sin descripción"}</p>
          <p><span className="label-theme">Stock:</span> {productoSeleccionado?.stock} unidades</p>
          <p><span className="label-theme">Precio:</span> <span className="text-cyan fw-bold">${productoSeleccionado?.precio}</span></p>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#1a1d24', borderColor: '#24272e' }}>
          <Button className="btn-theme-primary" onClick={() => setProductoSeleccionado(null)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}