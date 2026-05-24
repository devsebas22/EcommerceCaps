import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";

const API_BASE = import.meta.env.VITE_API_URL;

const TIERS = [
  { min: 0,       max: 100000,   nombre: "Bronce", color: "#CD7F32", bg: "#FDF5E6", border: "#CD7F32" },
  { min: 100000,  max: 300000,   nombre: "Plata",  color: "#8E8E93", bg: "#F5F5F7", border: "#8E8E93" },
  { min: 300000,  max: 1000000,  nombre: "Oro",    color: "#FF9500", bg: "#FFF8EE", border: "#FF9500" },
  { min: 1000000, max: Infinity, nombre: "VIP",    color: "#E31837", bg: "#FFF1F3", border: "#E31837" },
];

function calcularTier(puntos) {
  for (const t of TIERS) {
    if (puntos >= t.min && puntos <= t.max) return t;
  }
  return TIERS[TIERS.length - 1];
}

const iconos = {
  person: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mail: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-10 7L2 7"/>
    </svg>
  ),
  phone: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  location: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    authFetch(`${API_BASE}/usuarios/${usuario.id}`)
      .then(r => { if (!r.ok) throw new Error("Error al obtener perfil"); return r.json(); })
      .then(data => { setPerfil(data); setCargando(false); })
      .catch(err => { setError(err.message); setCargando(false); });
  }, [usuario, navigate]);

  if (!usuario) return null;

  if (cargando) {
    return (
      <div className="auth-page">
        <div style={{ width: "100%", maxWidth: "560px" }}>
          <div style={{ height: "32px", width: "120px", borderRadius: "8px", margin: "0 auto 40px" }} className="skeleton-shimmer" />
          <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "32px" }}>
            <div style={{ display: "flex", gap: "18px", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0 }} className="skeleton-shimmer" />
              <div style={{ flex: 1 }}>
                <div style={{ height: "18px", width: "60%", borderRadius: "6px", marginBottom: "8px" }} className="skeleton-shimmer" />
                <div style={{ height: "14px", width: "80%", borderRadius: "5px" }} className="skeleton-shimmer" />
              </div>
            </div>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: "14px", width: "100%", borderRadius: "5px", marginBottom: "16px" }} className="skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-page">
        <p style={{ color: "#CC2D22" }}>{error}</p>
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
    const res = await authFetch(`${API_BASE}/usuarios/${perfil.id}`, {
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
          <p className="navbar-brand-theme" style={{ fontSize: "1.05rem", letterSpacing: "2px", marginBottom: "10px" }}>
            CAPSCO
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.5rem", margin: 0 }}>
            Mi Perfil
          </h2>
        </div>

        {/* Tarjeta de información */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "32px",
          boxShadow: "var(--sh-sm)",
          marginBottom: "16px",
        }}>
          {/* Avatar + nombre */}
          <div style={{
            display: "flex", alignItems: "center", gap: "18px",
            marginBottom: "28px", paddingBottom: "24px",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "var(--bg-1)", border: "1px solid var(--border-md)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", color: "var(--t1)", fontWeight: 700, flexShrink: 0,
            }}>
              {perfil.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 style={{ color: "var(--t1)", fontWeight: 700, margin: "0 0 3px", fontSize: "1.05rem" }}>
                {perfil.nombre}
              </h5>
              <p style={{ color: "var(--t2)", fontSize: "0.84rem", margin: "0 0 2px" }}>{perfil.email}</p>
              <p style={{ color: "var(--t3)", fontSize: "0.75rem", margin: 0 }}>#{perfil.id}</p>
            </div>
          </div>

          {/* Campos */}
          {campos.map(({ label, value, icon, pendiente }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "14px 0",
              borderBottom: pendiente ? "1px dashed #FF9F0A" : "1px solid var(--border)",
            }}>
              <div style={{ flexShrink: 0, width: "20px", color: "var(--t3)", display: "flex", justifyContent: "center" }}>
                {icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="label-theme" style={{ margin: 0, fontSize: "0.68rem" }}>{label}</span>
                  {pendiente && (
                    <span style={{
                      fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
                      color: "#BF6900", background: "#FFF8EE",
                      padding: "1px 8px", borderRadius: "4px",
                      border: "1px solid #FF9F0A",
                    }}>
                      Pendiente
                    </span>
                  )}
                </div>
                <span style={{ color: pendiente ? "var(--t3)" : "var(--t1)", fontSize: "0.9rem", fontStyle: pendiente ? "italic" : "normal" }}>
                  {value || (label === "Teléfono" ? "No registrado" : "No registrada")}
                </span>
              </div>
            </div>
          ))}

          {mensajeEdit && (
            <div style={{
              marginTop: "16px", padding: "10px 16px", borderRadius: "var(--r2)",
              background: mensajeEdit.tipo === "ok" ? "#F0FAF4" : "#FFF2F1",
              border: `1px solid ${mensajeEdit.tipo === "ok" ? "#30D158" : "#FF3B30"}`,
              color: mensajeEdit.tipo === "ok" ? "#1A7F37" : "#CC2D22",
              fontSize: "0.84rem", textAlign: "center",
            }}>
              {mensajeEdit.texto}
            </div>
          )}

          {/* Editar */}
          {!editando ? (
            <button
              onClick={abrirEdicion}
              style={{
                marginTop: "20px",
                background: "none",
                border: "1px solid var(--border-md)",
                color: "var(--t2)",
                borderRadius: "var(--r2)",
                padding: "10px 18px",
                fontSize: "0.84rem",
                cursor: "pointer",
                fontFamily: "inherit",
                width: "100%",
                transition: "border-color .15s, color .15s",
              }}
              onMouseOver={e => { e.currentTarget.style.color = "#E31837"; e.currentTarget.style.borderColor = "#E31837"; }}
              onMouseOut={e => { e.currentTarget.style.color = "var(--t2)"; e.currentTarget.style.borderColor = "var(--border-md)"; }}
            >
              Editar contacto
            </button>
          ) : (
            <div style={{ marginTop: "20px" }}>
              <div style={{ marginBottom: "14px" }}>
                <label className="label-theme" style={{ fontSize: "0.68rem" }}>Teléfono</label>
                <input
                  className="input-theme"
                  type="tel"
                  value={formEdit.telefono}
                  onChange={(e) => setFormEdit(f => ({ ...f, telefono: e.target.value }))}
                  placeholder="+57 300 000 0000"
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>
              <div style={{ marginBottom: "18px" }}>
                <label className="label-theme" style={{ fontSize: "0.68rem" }}>Dirección</label>
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
                  style={{ flex: 1, padding: "10px" }}
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
                    padding: "10px 16px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.84rem",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tarjeta puntos de fidelidad */}
        <div style={{
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "32px",
          boxShadow: "var(--sh-sm)",
          marginBottom: "16px",
        }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span className="label-theme" style={{ fontSize: "0.68rem", display: "block", marginBottom: "12px" }}>
              Puntos de fidelidad
            </span>
            <span style={{ fontSize: "3rem", fontWeight: 800, color: "#34C759", lineHeight: 1 }}>
              {perfil.puntos_fidelidad}
            </span>
            <span style={{ color: "var(--t2)", fontSize: "0.85rem", fontWeight: 600, marginLeft: "4px" }}>pts</span>
          </div>

          {/* Tier badge */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{
              display: "inline-block",
              background: tier.bg,
              color: tier.color,
              border: `1px solid ${tier.border}`,
              borderRadius: "20px",
              fontSize: "0.72rem",
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
              <div style={{ width: "100%", height: "6px", background: "var(--bg-1)", borderRadius: "3px", overflow: "hidden", marginBottom: "10px" }}>
                <div style={{
                  width: `${progreso}%`, height: "100%",
                  background: tier.color, borderRadius: "3px",
                  transition: "width .6s ease",
                }} />
              </div>
              <p style={{ color: "var(--t2)", fontSize: "0.8rem", textAlign: "center", margin: 0 }}>
                Te faltan <strong style={{ color: "var(--t1)" }}>{puntosFaltantes}</strong> pts para alcanzar{" "}
                <strong style={{ color: siguienteTier.color }}>{siguienteTier.nombre}</strong>
              </p>
            </>
          ) : (
            <p style={{ color: "#1A7F37", fontSize: "0.85rem", textAlign: "center", margin: 0, fontWeight: 600 }}>
              Has alcanzado el nivel más alto
            </p>
          )}
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            background: "none",
            border: "1px solid var(--border-md)",
            color: "#CC2D22",
            borderRadius: "var(--r2)",
            padding: "13px",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
