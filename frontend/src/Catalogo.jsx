import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Alert, Button, Container } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/productos/`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        
        // SI LA BD ESTÁ VACÍA, CARGAMOS ESTOS DE PRUEBA PARA VER EL DISEÑO
        if (mounted) {
          setProductos(data.length > 0 ? data : [
            { id: 1, nombre: "Gorra Snapback Classic", precio: 25.00, categoria: {nombre: "PREMIUM"} },
            { id: 2, nombre: "Trucker Hat Gold Edition", precio: 32.00, categoria: {nombre: "LIMITED"} },
            { id: 3, nombre: "Beanie Winter Black", precio: 18.50, categoria: {nombre: "ESSENTIALS"} }
          ]);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
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
      {/* Título Estético que ya tienes */}
      <div className="mb-5">
        <h2 className="fw-bold text-white text-uppercase" style={{letterSpacing: '1px'}}>Nuestros Productos</h2>
        <div style={{ width: "60px", height: "4px", backgroundColor: "var(--accent-cyan)" }}></div>
      </div>

      {/* REJILLA DE CONTENEDORES (ESTE ES EL "ALMACENAJE" VISUAL) */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {productos.map((p) => (
          <Col key={p.id}>
            {/* El 'Container' principal del producto es esta Card */}
            <Card className="h-100 card-theme border-0 overflow-hidden shadow-sm">
              
              {/* Espacio para la imagen (Almacenaje visual de la foto) */}
              <div style={{ height: '200px', backgroundColor: '#08090a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="text-muted small">IMAGEN PRODUCTO</span>
              </div>

              <Card.Body className="d-flex flex-column p-4">
                {/* Contenedor de Categoría */}
                <span className="label-theme mb-2 small fw-bold">
                  {p.categoria?.nombre || "COLECCIÓN"}
                </span>
                
                {/* Contenedor del Nombre */}
                <Card.Title className="fw-bold mb-3 text-white">
                  {p.nombre}
                </Card.Title>

                <div className="mt-auto">
                  {/* Contenedor de Precio y Acción */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small text-uppercase">Precio</span>
                    <span className="fs-5 fw-bold text-cyan">${p.precio}</span>
                  </div>
                  
                  <Button className="btn-theme-primary w-100 py-2 fw-bold text-uppercase" style={{fontSize: '0.8rem'}}>
                    Ver Detalles
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}