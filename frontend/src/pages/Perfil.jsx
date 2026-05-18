import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000";

const TIERS = [
  { min: 0,    max: 99,   nombre: "Bronce", color: "#cd7f32", bg: "rgba(205,127,50,0.12)" },
  { min: 100,  max: 299,  nombre: "Plata",  color: "#a0a0a0", bg: "rgba(160,160,160,0.12)" },
  { min: 300,  max: Infinity, nombre: "Oro", color: "#d4af5f", bg: "rgba(212,175,95,0.12)" },
];

function calcularTier(puntos) {
  for (const t of TIERS) {
    if (puntos >= t.min && puntos <= t.max) return t;
  }
  return TIERS[TIERS.length - 1];
}

const iconos = {
  person: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-10 7L2 7"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

export default function Perfil({ usuario, onLogout, onUsuarioActualizado }) {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({ telefono: "", direccion: "" });
  const [guardando, setGuardando] = useState(false);
  const [mensajeEdit, setMensajeEdit] = useState(null);

  useEffect(() => {
    if (!usuario) { navigate("/login"); return; }
    fetch(`${API_BASE}/usuarios/${usuario.id}`)
      .then(r => { if (!r.ok) throw new Error("Error al obtener perfil"); return r.json(); })
      .then(data => { setPerfil(data); setCargando(false); })
      .catch(err => { setError(err.message); setCargando(false); });
  }, [usuario, navigate]);

  if (!usuario) return null;

  if (cargando) {
    return (
      <div className="auth-page">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-page">
        <p style={{ color: "var(--err)" }}>{error}</p>
      </div>
    );
  }

  if (!perfil) return null;

  const tier = calcularTier(perfil.puntos_fidelidad);
  const tierIndex = TIERS.indexOf(tier);
  const siguienteTier = tierIndex < TIERS.length - 1 ? TIERS[tierIndex + 1] : null;
  const progreso = siguienteTier
    ? Math.min(((perfil.puntos_fidelidad - tier.min) / (siguienteTier.min - tier.min)) * 100, 100)
    : 100;
  const puntosFaltantes = siguienteTier ? siguienteTier.min - perfil.puntos_fidelidad : 0;

  const campos = [
    { label: "Nombre completo", value: perfil.nombre, icon: iconos.person, pendiente: false },
    { label: "Correo electrónico", value: perfil.email, icon: iconos.mail, pendiente: false },
    { label: "Teléfono", value: perfil.telefono, icon: iconos.phone, pendiente: !perfil.telefono },
    { label: "Dirección", value: perfil.direccion, icon: iconos.location, pendiente: !perfil.direccion },
  ];
  const abrirEdicion = () => {
  setFormEdit({ telefono: perfil.telefono || "", direccion: perfil.direccion || "" });
  setEditando(true);
};

const guardarEdicion = async () => {
  setGuardando(true);
  const res = await fetch(`${API_BASE}/usuarios/${perfil.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre: perfil.nombre,
      email: perfil.email,
      direccion: formEdit.direccion,
      telefono: formEdit.telefono,
    }),
  });
  if (res.ok) {
    const data = await res.json();
    setPerfil(data);
    // Sincronizar estado global y localStorage con los campos editables
    const actualizado = { ...usuario, direccion: data.direccion, telefono: data.telefono };
    localStorage.setItem("usuario", JSON.stringify(actualizado));
    onUsuarioActualizado?.(actualizado);
    setEditando(false);
    setMensajeEdit({ tipo: "ok", texto: "Perfil actualizado correctamente" });
    setTimeout(() => setMensajeEdit(null), 3000);
  } else {
    setMensajeEdit({ tipo: "err", texto: "Error al actualizar perfil" });
    setTimeout(() => setMensajeEdit(null), 3000);
  }
  setGuardando(false);
};

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: "560px" }}>
        <div className="text-center mb-5">
          <p className="navbar-brand-theme" style={{ fontSize: "1.1rem", letterSpacing: "2.5px", marginBottom: "8px" }}>
            ECOMMERCE CAPS
          </p>
          <h2 className="fw-bold mb-1" style={{ color: "var(--t1)", fontSize: "1.6rem" }}>
            Mi Perfil
          </h2>
        </div>

        {/* ── Tarjeta de información personal ── */}
        <div style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "32px",
          boxShadow: "var(--sh-md)",
          marginBottom: "24px",
        }}>
          {/* Avatar + nombre */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "28px",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold-dk), var(--gold-lt))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              color: "#0a0a0a",
              fontWeight: 800,
              flexShrink: 0,
            }}>
              {perfil.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 style={{ color: "var(--t1)", fontWeight: 700, margin: "0 0 4px", fontSize: "1.1rem" }}>
                {perfil.nombre}
              </h5>
              <p style={{ color: "var(--t2)", fontSize: "0.84rem", margin: "0 0 2px" }}>
                {perfil.email}
              </p>
              <p style={{ color: "var(--t3)", fontSize: "0.75rem", margin: 0, letterSpacing: "0.5px" }}>
                ID: #{perfil.id}
              </p>
            </div>
          </div>

          {/* Campos dinámicos */}
          {campos.map(({ label, value, icon, pendiente }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 0",
                borderBottom: pendiente ? "1px dashed var(--warn)" : "1px solid var(--border)",
              }}
            >
              <div style={{ flexShrink: 0, width: "20px", display: "flex", justifyContent: "center" }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="label-theme" style={{ margin: 0, fontSize: "0.7rem" }}>
                    {label}
                  </span>
                  {pendiente && (
                    <span style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "var(--warn)",
                      background: "rgba(251,191,36,0.1)",
                      padding: "1px 8px",
                      borderRadius: "4px",
                      border: "1px solid rgba(251,191,36,0.2)",
                    }}>
                      Pendiente
                    </span>
                  )}
                </div>
                <span style={{
                  color: pendiente ? "var(--t3)" : "var(--t1)",
                  fontSize: "0.9rem",
                  fontStyle: pendiente ? "italic" : "normal",
                }}>
                  {value || (label === "Teléfono" ? "No registrado" : "No registrada")}
                </span>
              </div>
            </div>
          ))}

          {/* Toast de confirmación */}
          {mensajeEdit && (
            <div style={{
              marginTop: "16px",
              padding: "10px 16px",
              borderRadius: "var(--r2)",
              background: mensajeEdit.tipo === "ok" ? "rgba(52,211,153,.07)" : "rgba(248,113,113,.07)",
              border: `1px solid ${mensajeEdit.tipo === "ok" ? "rgba(52,211,153,.22)" : "rgba(248,113,113,.22)"}`,
              color: mensajeEdit.tipo === "ok" ? "#34d399" : "#f87171",
              fontSize: "0.84rem",
              textAlign: "center",
            }}>
              {mensajeEdit.texto}
            </div>
          )}

          {/* Botón editar / Formulario inline */}
          {!editando ? (
            <button
              onClick={abrirEdicion}
              style={{
                marginTop: "20px",
                background: "none",
                border: "1px solid var(--border-md)",
                color: "var(--t2)",
                borderRadius: "var(--r2)",
                padding: "9px 18px",
                fontSize: "0.83rem",
                cursor: "pointer",
                fontFamily: "inherit",
                width: "100%",
                transition: "all .18s var(--ease)",
              }}
            >
              ✏️ Editar contacto
            </button>
          ) : (
            <div style={{ marginTop: "20px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label className="label-theme" style={{ fontSize: "0.7rem" }}>Teléfono</label>
                <input
                  className="input-theme"
                  type="tel"
                  value={formEdit.telefono}
                  onChange={(e) => setFormEdit(f => ({ ...f, telefono: e.target.value }))}
                  placeholder="Ej: +57 300 000 0000"
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "18px" }}>
                <label className="label-theme" style={{ fontSize: "0.7rem" }}>Dirección</label>
                <input
                  className="input-theme"
                  type="text"
                  value={formEdit.direccion}
                  onChange={(e) => setFormEdit(f => ({ ...f, direccion: e.target.value }))}
                  placeholder="Calle 123, Ciudad"
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  className="btn-theme-primary"
                  style={{ flex: 1, padding: "9px" }}
                  onClick={guardarEdicion}
                  disabled={guardando}
                >
                  {guardando ? "Guardando…" : "Guardar"}
                </Button>
                <button
                  onClick={() => setEditando(false)}
                  style={{
                    flex: "0 0 auto",
                    background: "none",
                    border: "1px solid var(--border-md)",
                    color: "var(--t2)",
                    borderRadius: "var(--r2)",
                    padding: "9px 16px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.83rem",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Tarjeta de Puntos de Fidelidad ── */}
        <div style={{
          background: "linear-gradient(135deg, rgba(52,211,153,0.04), rgba(52,211,153,0.01))",
          border: "1px solid rgba(52,211,153,0.25)",
          borderRadius: "var(--r3)",
          padding: "32px",
          boxShadow: "0 0 30px rgba(52,211,153,0.06), var(--sh-md)",
          marginBottom: "24px",
        }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span className="label-theme" style={{ fontSize: "0.7rem", marginBottom: "12px" }}>
              Puntos de Fidelidad
            </span>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
              <span style={{
                fontSize: "3rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #34d399, #059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.1,
              }}>
                {perfil.puntos_fidelidad}
              </span>
              <span style={{ color: "var(--t2)", fontSize: "0.85rem", fontWeight: 600 }}>pts</span>
            </div>
          </div>

          {/* Badge de Tier */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{
              display: "inline-block",
              background: tier.bg,
              color: tier.color,
              border: `1px solid ${tier.color}33`,
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.6px",
              padding: "4px 16px",
              textTransform: "uppercase",
            }}>
              Nivel {tier.nombre}
            </span>
          </div>

          {/* Barra de progreso */}
          {siguienteTier ? (
            <>
              <div style={{
                width: "100%",
                height: "8px",
                background: "var(--bg-4)",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "10px",
              }}>
                <div style={{
                  width: `${progreso}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #34d399, #059669)",
                  borderRadius: "4px",
                  transition: "width 0.6s ease",
                }} />
              </div>
              <p style={{ color: "var(--t2)", fontSize: "0.8rem", textAlign: "center", margin: 0 }}>
                Te faltan{" "}
                <strong style={{ color: "var(--t1)" }}>{puntosFaltantes}</strong> pts para llegar a{" "}
                <strong style={{ color: tier.color }}>{siguienteTier.nombre}</strong>
              </p>
            </>
          ) : (
            <p style={{ color: "var(--ok)", fontSize: "0.85rem", textAlign: "center", margin: 0, fontWeight: 600 }}>
              ¡Has alcanzado el nivel más alto!
            </p>
          )}
        </div>

        {/* ── Botón Cerrar Sesión ── */}
        <Button
          variant="outline-danger"
          className="w-100"
          style={{ borderRadius: "var(--r2)", padding: "12px" }}
          onClick={onLogout}
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
