import React, { useState, useEffect } from "react";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { authFetch } from "../utils/api";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Usuarios({ admin }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [orden, setOrden] = useState({ campo: "id", dir: "asc" });
  const [confirmData, setConfirmData] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const flash = (tipo, texto) => { setMensaje({ tipo, texto }); setTimeout(() => setMensaje(null), 3200); };

  useEffect(() => { cargarUsuarios(); }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const res = await authFetch(`${API_BASE}/usuarios/`);
    setUsuarios(await res.json());
    setCargando(false);
  };

  const ordenar = (campo) => {
    setOrden((prev) => ({ campo, dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc" }));
  };

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    const val = orden.dir === "asc" ? 1 : -1;
    if (a[orden.campo] < b[orden.campo]) return -val;
    if (a[orden.campo] > b[orden.campo]) return val;
    return 0;
  });

  const confirmarEliminar = async () => {
    const res = await authFetch(`${API_BASE}/usuarios/${confirmData.id}`, { method: "DELETE" });
    setConfirmData(null);
    if (res.ok) { flash("ok", "Usuario eliminado"); cargarUsuarios(); }
    else {
      const err = await res.json();
      flash("err", err.detail ?? "Error al eliminar");
    }
  };

  const thStyle = { padding: "13px 18px", textAlign: "left", color: "var(--t2)", fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--bg-1)", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
  const tdStyle = { padding: "14px 18px", verticalAlign: "middle", borderBottom: "1px solid var(--border)" };

  return (
    <div>
      <ConfirmModal
        show={!!confirmData}
        titulo="Eliminar Usuario"
        mensaje={`¿Eliminar al usuario "${confirmData?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setConfirmData(null)}
      />
      <Toast mensaje={mensaje} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <h4 style={{ color: "var(--t1)", fontWeight: 800, margin: "0 0 6px", fontSize: "1.25rem" }}>Usuarios</h4>
          <div className="heading-line" />
        </div>
      </div>

      <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden", boxShadow: "var(--sh-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              {[["id","ID"],["nombre","Nombre"],["email","Email"],["telefono","Teléfono"],["puntos_fidelidad","Puntos"],["es_admin","Rol"]].map(([campo, label]) => (
                <th key={campo} style={thStyle} onClick={() => ordenar(campo)}>
                  {label} {orden.campo === campo ? (orden.dir === "asc" ? "↑" : "↓") : <span style={{ opacity: 0.35 }}>↕</span>}
                </th>
              ))}
              <th style={{ ...thStyle, cursor: "default" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              [1,2,3].map(i => (
                <tr key={i}>
                  {[1,2,3,4,5,6,7].map(j => (
                    <td key={j} style={{ ...tdStyle, padding: "20px 18px" }}>
                      <div style={{ height: "14px", borderRadius: "6px" }} className="skeleton-shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : usuariosOrdenados.map((u) => (
              <tr key={u.id}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-1)"}
                onMouseOut={e => e.currentTarget.style.background = ""}
                style={{ transition: "background .1s" }}
              >
                <td style={{ ...tdStyle, color: "var(--t2)" }}>#{u.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{u.nombre}</td>
                <td style={{ ...tdStyle, color: "var(--t2)" }}>{u.email}</td>
                <td style={{ ...tdStyle, color: "var(--t2)" }}>{u.telefono || "—"}</td>
                <td style={{ ...tdStyle, color: "var(--t1)", fontWeight: 700 }}>{u.puntos_fidelidad}</td>
                <td style={tdStyle}>
                  <span style={{
                    display: "inline-block",
                    background: u.es_admin ? "#EEF4FF" : "#F5F5F7",
                    color: u.es_admin ? "#0A84FF" : "#6E6E73",
                    border: `1px solid ${u.es_admin ? "#0A84FF" : "#D2D2D7"}`,
                    borderRadius: "20px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: "3px 12px",
                  }}>
                    {u.es_admin ? "Admin" : "Cliente"}
                  </span>
                </td>
                <td style={tdStyle}>
                  {!u.es_admin && (
                    <button
                      onClick={() => setConfirmData({ id: u.id, nombre: u.nombre })}
                      style={{
                        background: "none", border: "none",
                        color: "#CC2D22", fontSize: "0.82rem",
                        cursor: "pointer", padding: "4px 0",
                        fontFamily: "inherit", fontWeight: 500,
                      }}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
