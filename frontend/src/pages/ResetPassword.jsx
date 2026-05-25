import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nueva_password: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Error al restablecer la contraseña");
        return;
      }
      setExito(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <p style={{ color: "var(--err)", fontSize: "0.9rem" }}>
            Enlace inválido. <Link to="/forgot-password" style={{ color: "var(--t1)", fontWeight: 600 }}>Solicitar nuevo enlace</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-5">
          <p className="navbar-brand-theme" style={{ fontSize: "1.05rem", letterSpacing: "2px", marginBottom: "10px" }}>
            CAPSCO
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 6px" }}>
            Nueva contraseña
          </h2>
          <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: 0 }}>
            Elige una contraseña segura
          </p>
        </div>

        <div style={{
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "36px",
          boxShadow: "var(--sh-sm)",
        }}>
          {exito ? (
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
                Contraseña actualizada
              </p>
              <p style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
                Redirigiendo al inicio de sesión…
              </p>
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
                  <Form.Label className="label-theme">Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    className="input-theme"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-5">
                  <Form.Label className="label-theme">Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    className="input-theme"
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="btn-theme-primary w-100"
                  style={{ padding: "14px" }}
                  disabled={cargando}
                >
                  {cargando ? "Guardando…" : "Guardar contraseña"}
                </Button>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
