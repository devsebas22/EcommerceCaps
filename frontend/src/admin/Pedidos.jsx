import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
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
  const [expandidoId, setExpandidoId] = useState(null);
  const [confirmEliminar, setConfirmEliminar] = useState(null);

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

  const actualizarEstado = async (pedidoId, estado, e) => {
    e.stopPropagation();
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

  const eliminarPedido = async () => {
    const res = await authFetch(`${API_BASE}/pedidos/${confirmEliminar.id}`, { method: "DELETE" });
    setConfirmEliminar(null);
    if (res.ok) {
      flash("ok", "Pedido eliminado");
      if (expandidoId === confirmEliminar.id) setExpandidoId(null);
      cargarPedidos();
    } else {
      const err = await res.json().catch(() => ({}));
      flash("err", err.detail || "Error al eliminar el pedido");
    }
  };

  const thStyle = { padding: "13px 18px", textAlign: "left", color: "var(--t2)", fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--bg-1)", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
  const tdStyle = { padding: "14px 18px", verticalAlign: "middle", borderBottom: "1px solid var(--border)" };

  return (
    <div>
      <ConfirmModal
        show={!!confirmEliminar}
        titulo="Eliminar Pedido"
        mensaje={`¿Eliminar el pedido #${confirmEliminar?.id}? Esta acción restaurará el stock si aplica y no se puede deshacer.`}
        onConfirmar={eliminarPedido}
        onCancelar={() => setConfirmEliminar(null)}
      />
      <Toast mensaje={mensaje} />
      <div className="table-scroll-wrap" style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "var(--r3)", boxShadow: "var(--sh-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", minWidth: "680px" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "28px", cursor: "default" }} />
              {[["id","ID",""],["usuario_nombre","Usuario",""],["total","Total",""],["direccion_envio","Dirección","hide-mobile"],["estado","Estado",""]].map(([campo, label, cls]) => (
                <th key={campo} className={cls} style={thStyle} onClick={() => ordenar(campo)}>
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
            ) : pedidosOrdenados.map((p) => (
              <React.Fragment key={p.id}>
                <tr
                  style={{ transition: "background .1s", cursor: "pointer" }}
                  onClick={() => setExpandidoId(expandidoId === p.id ? null : p.id)}
                  onMouseOver={e => e.currentTarget.style.background = "var(--bg-1)"}
                  onMouseOut={e => e.currentTarget.style.background = ""}
                >
                  {/* Ícono expand */}
                  <td style={{ ...tdStyle, paddingLeft: "18px", paddingRight: "4px", color: "var(--t3)" }}>
                    <span style={{
                      display: "inline-block",
                      transition: "transform .2s",
                      transform: expandidoId === p.id ? "rotate(90deg)" : "rotate(0deg)",
                      fontSize: "0.75rem",
                    }}>▶</span>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--t2)" }}>#{p.id}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{p.usuario_nombre || `Usuario #${p.usuario_id}`}</td>
                  <td style={{ ...tdStyle, color: "var(--t1)", fontWeight: 700 }}>${p.total.toLocaleString()}</td>
                  <td className="hide-mobile" style={{ ...tdStyle, color: "var(--t2)", fontSize: "0.85rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.direccion_envio}</td>
                  <td style={tdStyle} onClick={e => e.stopPropagation()}>
                    <select
                      value={p.estado}
                      onChange={(e) => actualizarEstado(p.id, e.target.value, e)}
                      style={estadoStyle(p.estado)}
                    >
                      {["pendiente","pagado","enviado","entregado","cancelado"].map((e) => (
                        <option key={e} value={e} style={{ background: "#FFFFFF", color: "#1D1D1F" }}>{e}</option>
                      ))}
                    </select>
                  </td>
                  <td style={tdStyle} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setConfirmEliminar({ id: p.id })}
                      style={{
                        background: "none", border: "none", color: "#CC2D22",
                        cursor: "pointer", fontFamily: "inherit", fontSize: "0.82rem",
                        fontWeight: 600, padding: "4px 8px", borderRadius: "6px",
                        transition: "background .15s",
                      }}
                      onMouseOver={e => e.currentTarget.style.background = "#FFF2F1"}
                      onMouseOut={e => e.currentTarget.style.background = "none"}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>

                {/* Fila expandida */}
                {expandidoId === p.id && (
                  <tr>
                    <td colSpan={7} style={{ padding: 0, borderBottom: "1px solid var(--border)" }}>
                      <div style={{ background: "#F5F5F7", padding: "16px 24px" }}>
                        {/* Tabla de items */}
                        {p.items && p.items.length > 0 ? (
                          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "12px" }}>
                            <thead>
                              <tr>
                                {["Producto","Cant.","Precio unit.","Subtotal"].map(h => (
                                  <th key={h} style={{ textAlign: "left", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--t2)", paddingBottom: "8px" }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {p.items.map((item) => {
                                const img = item.producto?.imagenes?.find(i => i.es_principal)?.url ?? item.producto?.imagenes?.[0]?.url;
                                return (
                                  <tr key={item.id}>
                                    <td style={{ padding: "6px 0", verticalAlign: "middle" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--border)", overflow: "hidden", flexShrink: 0 }}>
                                          {img && <img src={img} alt={item.producto?.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                        </div>
                                        <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--t1)" }}>
                                          {item.producto?.nombre || `Producto #${item.producto_id}`}
                                        </span>
                                      </div>
                                    </td>
                                    <td style={{ padding: "6px 8px", fontSize: "0.86rem", color: "var(--t2)", verticalAlign: "middle" }}>×{item.cantidad}</td>
                                    <td style={{ padding: "6px 8px", fontSize: "0.86rem", color: "var(--t2)", verticalAlign: "middle" }}>${Number(item.precio_unitario).toLocaleString()}</td>
                                    <td style={{ padding: "6px 8px", fontSize: "0.86rem", fontWeight: 700, color: "var(--t1)", verticalAlign: "middle" }}>${(item.precio_unitario * item.cantidad).toLocaleString()}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <p style={{ color: "var(--t3)", fontSize: "0.82rem", margin: "0 0 10px" }}>Sin items</p>
                        )}
                        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--t2)" }}>
                          <span style={{ fontWeight: 600, color: "var(--t1)" }}>Dirección:</span> {p.direccion_envio}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
