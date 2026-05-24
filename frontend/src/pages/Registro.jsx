import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [exitoso, setExitoso] = useState(false);
  const navigate = useNavigate();

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
        setExitoso(true);
      } else {
        const err = await res.json();
        setMessage(err.detail || "Error al registrar");
      }
    } catch {
      setMessage("Error de conexión con el servidor");
    } finally {
      setSubmitting(false);
    }
  };

  if (exitoso) {
    return (
      <div className="auth-page">
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <div style={{
            background: "#FFFFFF",
            border: "1px solid var(--border)",
            borderRadius: "var(--r3)",
            padding: "52px 36px",
            boxShadow: "var(--sh-sm)",
          }}>
            <div style={{
              width: "56px", height: "56px",
              background: "#F0FAF4",
              border: "1px solid #30D158",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A7F37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h4 style={{ color: "var(--t1)", fontWeight: 700, margin: "0 0 8px" }}>Cuenta creada</h4>
            <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: "0 0 32px" }}>
              Tu cuenta fue creada correctamente. Ya puedes iniciar sesión.
            </p>
            <Button className="btn-theme-primary w-100" style={{ padding: "13px" }} onClick={() => navigate("/login")}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const fieldError = (key) => errors[key] ? (
    <div style={{ color: "#CC2D22", fontSize: "0.78rem", marginTop: "5px" }}>{errors[key]}</div>
  ) : null;

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div className="text-center mb-5">
          <p className="navbar-brand-theme" style={{ fontSize: "1.05rem", letterSpacing: "2px", marginBottom: "10px" }}>
            CAPSCO
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 6px" }}>
            Crea tu cuenta
          </h2>
          <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: 0 }}>
            Únete y empieza a explorar la colección
          </p>
        </div>

        <div style={{
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "36px",
          boxShadow: "var(--sh-sm)",
        }}>
          {message && (
            <div style={{
              background: "#FFF2F1",
              border: "1px solid #FF3B30",
              color: "#CC2D22",
              borderRadius: "var(--r2)",
              padding: "10px 14px",
              fontSize: "0.85rem",
              marginBottom: "20px",
              textAlign: "center",
            }}>
              {message}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="label-theme">Nombre completo</Form.Label>
              <Form.Control
                type="text"
                className={`input-theme${errors.nombre ? " is-invalid" : ""}`}
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {fieldError("nombre")}
            </Form.Group>

            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Label className="label-theme">Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  className={`input-theme${errors.email ? " is-invalid" : ""}`}
                  placeholder="nombre@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {fieldError("email")}
              </Col>
              <Col md={6}>
                <Form.Label className="label-theme">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  className={`input-theme${errors.password ? " is-invalid" : ""}`}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {fieldError("password")}
              </Col>
            </Row>

            <Row className="g-3 mb-5">
              <Col md={7}>
                <Form.Label className="label-theme">
                  Dirección <span style={{ color: "var(--t3)", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(opcional)</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="input-theme"
                  placeholder="Calle 123, Ciudad"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </Col>
              <Col md={5}>
                <Form.Label className="label-theme">
                  Teléfono <span style={{ color: "var(--t3)", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(opcional)</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  className="input-theme"
                  placeholder="300 000 0000"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </Col>
            </Row>

            <Button type="submit" className="btn-theme-primary w-100" style={{ padding: "14px" }} disabled={submitting}>
              {submitting ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
          </Form>

          <p className="text-center mt-4 mb-0" style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" style={{ color: "var(--t1)", fontWeight: 600, textDecoration: "none" }}>
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
