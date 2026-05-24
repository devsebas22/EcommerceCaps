import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Credenciales incorrectas"); return; }
      onLogin(data);
      navigate(data.es_admin ? "/admin" : "/");
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div className="text-center mb-5">
          <p className="navbar-brand-theme" style={{ fontSize: "1.05rem", letterSpacing: "2px", marginBottom: "10px" }}>
            CAPSCO
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 6px" }}>
            Bienvenido de nuevo
          </h2>
          <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: 0 }}>
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "36px",
          boxShadow: "var(--sh-sm)",
        }}>
          {error && (
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
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="label-theme">Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                className="input-theme"
                placeholder="nombre@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-5">
              <Form.Label className="label-theme">Contraseña</Form.Label>
              <Form.Control
                type="password"
                className="input-theme"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-theme-primary w-100"
              style={{ padding: "14px" }}
              disabled={cargando}
            >
              {cargando ? "Ingresando…" : "Iniciar Sesión"}
            </Button>
          </Form>

          <p className="text-center mt-4 mb-0" style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
            ¿No tienes cuenta?{" "}
            <Link to="/registro" style={{ color: "var(--t1)", fontWeight: 600, textDecoration: "none" }}>
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
