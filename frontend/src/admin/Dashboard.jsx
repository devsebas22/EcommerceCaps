import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AdminProductos from "./Productos";

export default function Dashboard({ admin, onLogout }) {
  const [vista, setVista] = useState("productos");

  const secciones = [
    { key: "productos", label: "Productos" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)" }}>
      {/* ── Barra superior ── */}
      <div className="admin-topbar">
        {/* Izquierda */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="admin-brand">ECOMMERCE CAPS</span>
          <nav className="admin-nav-pill">
            {secciones.map((s) => (
              <button
                key={s.key}
                className={`admin-nav-item${vista === s.key ? " active" : ""}`}
                onClick={() => setVista(s.key)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--t1)", fontSize: "0.87rem", fontWeight: 600, lineHeight: 1.2 }}>
              {admin.nombre}
            </div>
            <div style={{ color: "var(--gold)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Administrador
            </div>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => { localStorage.removeItem("usuario"); onLogout(); }}
            style={{ borderRadius: "8px", fontSize: "0.8rem", padding: "7px 18px" }}
          >
            Salir
          </Button>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div style={{ padding: "36px 32px" }}>
        {vista === "productos" && <AdminProductos />}
      </div>
    </div>
  );
}
