import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { authFetch } from "../utils/api";

const API_BASE = import.meta.env.VITE_API_URL;

const ESTADO_STYLE = {
  pendiente: { background: "#FFF8EE", border: "1px solid #FF9F0A", color: "#BF6900" },
  pagado:    { background: "#F0FAF4", border: "1px solid #30D158", color: "#1A7F37" },
  enviado:   { background: "#EEF4FF", border: "1px solid #0A84FF", color: "#0A6FBB" },
  entregado: { background: "#E8F8EE", border: "1px solid #25A844", color: "#1A6B30" },
  cancelado: { background: "#FFF2F1", border: "1px solid #FF3B30", color: "#CC2D22" },
};

const estadoStyle = (estado) => ({
  ...ESTADO_STYLE[estado] ?? ESTADO_STYLE.cancelado,
  borderRadius: "8px",
  padding: "5px 10px",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
});

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [orden, setOrden] = useState({ campo: "id", dir: "asc" });
  const [mensaje, setMensaje] = useState(null);

  const flash = (tipo, texto) => { setMensaje({ tipo, texto }); setTimeout(() => setMensaje(null), 4000); };

  useEffect(() => { cargarPedidos(); }, []);

  const cargarPedidos = async () => {
    setCargando(true);
    try {
      const res = await authFetch(`${API_BASE}/pedidos/todos/`);
      if (!res.ok) throw new Error();
      setPedidos(await res.json());
    } catch {
      flash("err", "Error al cargar pedidos");
    } finally {
      setCargando(false);
    }
  };

  const ordenar = (campo) => {
    setOrden((prev) => ({ campo, dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc" }));
  };

  const pedidosOrdenados = [...pedidos].sort((a, b) => {
    const val = orden.dir === "asc" ? 1 : -1;
    if (a[orden.campo] < b[orden.campo]) return -val;
    if (a[orden.campo] > b[orden.campo]) return val;
    return 0;
  });

  const actualizarEstado = async (pedidoId, estado) => {
    const res = await authFetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      flash("err", err.detail || "Error al actualizar el estado");
    }
    cargarPedidos();
  };

  const thStyle = { padding: "13px 18px", textAlign: "left", color: "var(--t2)", fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--bg-1)", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
  const tdStyle = { padding: "14px 18px", verticalAlign: "middle", borderBottom: "1px solid var(--border)" };

  return (
    <div>
      <Toast mensaje={mensaje} />
      <div style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden", boxShadow: "var(--sh-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              {[["id","ID"],["usuario_nombre","Usuario"],["total","Total"],["direccion_envio","Dirección"],["estado","Estado"]].map(([campo, label]) => (
                <th key={campo} style={thStyle} onClick={() => ordenar(campo)}>
                  {label} {orden.campo === campo ? (orden.dir === "asc" ? "↑" : "↓") : <span style={{ opacity: 0.35 }}>↕</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              [1,2,3].map(i => (
                <tr key={i}>
                  {[1,2,3,4,5].map(j => (
                    <td key={j} style={{ ...tdStyle, padding: "20px 18px" }}>
                      <div style={{ height: "14px", borderRadius: "6px" }} className="skeleton-shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pedidosOrdenados.map((p) => (
              <tr key={p.id} style={{ transition: "background .1s" }}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-1)"}
                onMouseOut={e => e.currentTarget.style.background = ""}
              >
                <td style={{ ...tdStyle, color: "var(--t2)" }}>#{p.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{p.usuario_nombre || `Usuario #${p.usuario_id}`}</td>
                <td style={{ ...tdStyle, color: "var(--t1)", fontWeight: 700 }}>${p.total.toLocaleString()}</td>
                <td style={{ ...tdStyle, color: "var(--t2)", fontSize: "0.85rem" }}>{p.direccion_envio}</td>
                <td style={tdStyle}>
                  <select
                    value={p.estado}
                    onChange={(e) => actualizarEstado(p.id, e.target.value)}
                    style={estadoStyle(p.estado)}
                  >
                    {["pendiente","pagado","enviado","entregado","cancelado"].map((e) => (
                      <option key={e} value={e} style={{ background: "#FFFFFF", color: "#1D1D1F" }}>{e}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
