import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Alert } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setCargando(true);
    fetch(`${API_BASE}/productos/`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setProductos(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Error al obtener productos");
      })
      .finally(() => mounted && setCargando(false));
    return () => (mounted = false);
  }, []);

  if (cargando)
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2 className="mb-4">Catálogo</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {productos.map((p) => (
          <Col key={p.id}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{p.nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {p.categoria?.nombre ?? p.categoria_id ?? "-"}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Precio:</strong> ${p.precio}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
