import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Error al procesar la solicitud");
        return;
      }
      setEnviado(true);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-5">
          <p className="navbar-brand-theme" style={{ fontSize: "1.05rem", letterSpacing: "2px", marginBottom: "10px" }}>
            CAPSCO
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 6px" }}>
            Recuperar contraseña
          </h2>
          <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: 0 }}>
            Te enviaremos un enlace a tu correo
          </p>
        </div>

        <div style={{
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "36px",
          boxShadow: "var(--sh-sm)",
        }}>
          {enviado ? (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "#F0FAF4", border: "1px solid #30D158",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A7F37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ color: "var(--t1)", fontWeight: 600, marginBottom: "8px" }}>
                Correo enviado
              </p>
              <p style={{ color: "var(--t2)", fontSize: "0.85rem", marginBottom: "24px", lineHeight: 1.6 }}>
                Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
              </p>
              <Link to="/login" style={{ color: "var(--t1)", fontWeight: 600, textDecoration: "none", fontSize: "0.88rem" }}>
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div style={{
                  background: "#FFF2F1", border: "1px solid #FF3B30", color: "#CC2D22",
                  borderRadius: "var(--r2)", padding: "10px 14px",
                  fontSize: "0.85rem", marginBottom: "20px", textAlign: "center",
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
                <Button
                  type="submit"
                  className="btn-theme-primary w-100"
                  style={{ padding: "14px" }}
                  disabled={cargando}
                >
                  {cargando ? "Enviando…" : "Enviar enlace"}
                </Button>
              </Form>
              <p className="text-center mt-4 mb-0" style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
                <Link to="/login" style={{ color: "var(--t1)", fontWeight: 600, textDecoration: "none" }}>
                  Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
