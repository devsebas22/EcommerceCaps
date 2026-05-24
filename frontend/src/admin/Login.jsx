import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

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
      if (!data.es_admin) { setError("No tienes permisos de administrador"); return; }
      localStorage.setItem("usuario", JSON.stringify(data));
      onLogin(data);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div className="text-center mb-5">
          <p className="navbar-brand-theme" style={{ fontSize: "1.05rem", letterSpacing: "2px", marginBottom: "10px" }}>
            CAPSCO
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 6px" }}>
            Panel de Administración
          </h2>
          <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: 0 }}>
            Acceso restringido al personal autorizado
          </p>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "36px", boxShadow: "var(--sh-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "var(--bg-1)", border: "1px solid var(--border-md)", borderRadius: "var(--r2)", marginBottom: "28px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--t2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span style={{ color: "var(--t2)", fontSize: "0.82rem", fontWeight: 500 }}>
              Solo administradores
            </span>
          </div>

          {error && (
            <Alert variant="danger" className="py-2 text-center mb-4" style={{ fontSize: "0.87rem" }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="label-theme">Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                className="input-theme"
                placeholder="admin@ecommerce.com"
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

            <Button type="submit" className="btn-theme-primary w-100" style={{ padding: "14px" }} disabled={cargando}>
              {cargando ? "Verificando…" : "Ingresar al Panel"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
