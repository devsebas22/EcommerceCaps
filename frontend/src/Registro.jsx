import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col, Card } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "Campo requerido";
    if (!email.trim()) e.email = "Campo requerido";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Email inválido";
    if (!password) e.password = "Campo requerido";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validar()) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, direccion, telefono }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Registro completado con éxito" });
        setNombre(""); setEmail(""); setPassword(""); setDireccion(""); setTelefono("");
      } else {
        const err = await res.json();
        setMessage({ type: "danger", text: err.detail || "Error al registrar" });
      }
    } catch (err) {
      setMessage({ type: "danger", text: "Error de conexión con el servidor" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={7} xl={6}>
          <Card className="card-theme p-3">
            <Card.Body>
              <div className="mb-5">
                <h3 className="fw-bold mb-1">Crea tu cuenta</h3>
                <p className="text-muted small">
                  Ingresa tus datos para empezar en <span className="text-cyan">Ecommerce Caps</span>
                </p>
              </div>

              {message && (
                <Alert variant={message.type === "success" ? "success" : "danger"} className="py-2 border-0 bg-opacity-10 text-center">
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="label-theme">Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    className="input-theme"
                    placeholder="Ej.Baljeet"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    isInvalid={!!errors.nombre}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label-theme">Email</Form.Label>
                      <Form.Control
                        type="email"
                        className="input-theme"
                        placeholder="nombre@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label-theme">Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        className="input-theme"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={7}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label-theme">Dirección (Opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        className="input-theme"
                        placeholder="Calle 123..."
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-4">
                      <Form.Label className="label-theme">Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        className="input-theme"
                        placeholder="300 000 0000"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2 mt-4">
                  <Button type="submit" className="btn-theme-primary" disabled={submitting}>
                    {submitting ? "Procesando..." : "Registrar ahora"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}