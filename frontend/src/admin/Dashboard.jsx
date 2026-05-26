import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { authFetch } from "../utils/api";
import Catalogo from "../pages/Catalogo";
import Usuarios from "./Usuarios";
import Pedidos from "./Pedidos";
import Categorias from "./Categorias";

const API_BASE = import.meta.env.VITE_API_URL;

const NAV_ITEMS = [
  { key: "productos",  label: "Productos"  },
  { key: "categorias", label: "Categorías" },
  { key: "usuarios",   label: "Usuarios"   },
  { key: "pedidos",    label: "Pedidos"    },
];

export default function Dashboard({ admin, onLogout }) {
  const [vista, setVista] = useState("productos");
  const [stats, setStats] = useState(null);

  useEffect(() => { cargarStats(); }, []);

  const cargarStats = async () => {
    try {
      const res = await authFetch(`${API_BASE}/stats/`);
      if (!res.ok) return;
      setStats(await res.json());
    } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-1)" }}>
      {/* Topbar */}
      <div className="admin-topbar">
        <span className="admin-brand">CAPSCO</span>
        <div className="admin-nav-pill">
          {NAV_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              className={`admin-nav-item${vista === key ? " active" : ""}`}
              onClick={() => setVista(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="admin-topbar-user">
          <span style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
            Hola, <strong style={{ color: "var(--t1)", fontWeight: 600 }}>{admin.nombre.split(" ")[0]}</strong>
          </span>
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "1px solid var(--border-md)",
              color: "var(--t2)",
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="admin-stats-grid">
          {[
            { label: "Productos",  value: stats.total_productos,     color: "#0071E3" },
            { label: "Usuarios",   value: stats.total_usuarios,      color: "#34C759" },
            { label: "Pedidos",    value: stats.total_pedidos,       color: "#FF9500" },
            { label: "Sin stock",  value: stats.productos_sin_stock, color: "#E31837" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "#FFFFFF",
              border: "1px solid var(--border)",
              borderRadius: "var(--r3)",
              padding: "22px 24px",
              boxShadow: "var(--sh-sm)",
            }}>
              <p style={{ color: "var(--t2)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>
                {s.label}
              </p>
              <p style={{ color: s.color, fontSize: "2.2rem", fontWeight: 800, margin: 0, lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Contenido */}
      <Container fluid className="py-4 px-3 px-md-4">
        {vista === "productos"  && <Catalogo usuario={admin} onCarritoChange={() => {}} esAdmin={true} />}
        {vista === "usuarios"   && <Usuarios admin={admin} />}
        {vista === "pedidos"    && <Pedidos />}
        {vista === "categorias" && <Categorias admin={admin} />}
      </Container>
    </div>
  );
}
