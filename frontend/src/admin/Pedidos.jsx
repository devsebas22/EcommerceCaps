import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_URL;

const estadoStyle = (estado) => ({
  background:
    estado === "pendiente" ? "rgba(251,191,36,.12)" :
    estado === "pagado"    ? "rgba(52,211,153,.12)"  :
    estado === "enviado"   ? "rgba(96,165,250,.12)"  :
    estado === "entregado" ? "rgba(52,211,153,.20)"  :
                             "rgba(248,113,113,.12)",
  border: `1px solid ${
    estado === "pendiente" ? "rgba(251,191,36,.35)" :
    estado === "pagado"    ? "rgba(52,211,153,.35)" :
    estado === "enviado"   ? "rgba(96,165,250,.35)" :
    estado === "entregado" ? "rgba(52,211,153,.50)" :
                             "rgba(248,113,113,.35)"}`,
  color:
    estado === "pendiente" ? "var(--warn)" :
    estado === "pagado"    ? "var(--ok)"   :
    estado === "enviado"   ? "#60a5fa"     :
    estado === "entregado" ? "var(--ok)"   :
                             "var(--err)",
  borderRadius: "var(--r1)",
  padding: "5px 10px",
  fontSize: "0.8rem",
  cursor: "pointer",
  fontWeight: 600,
});

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [orden, setOrden] = useState({ campo: "id", dir: "asc" });

  useEffect(() => { cargarPedidos(); }, []);

  const cargarPedidos = async () => {
    setCargando(true);
    const res = await fetch(`${API_BASE}/pedidos/todos/`);
    setPedidos(await res.json());
    setCargando(false);
  };

  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc"
    }));
  };

  const pedidosOrdenados = [...pedidos].sort((a, b) => {
    const val = orden.dir === "asc" ? 1 : -1;
    if (a[orden.campo] < b[orden.campo]) return -val;
    if (a[orden.campo] > b[orden.campo]) return val;
    return 0;
  });

  const actualizarEstado = async (pedidoId, estado) => {
    await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    cargarPedidos();
  };

  return (
    <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden" }}>
      <Table className="table-admin" responsive>
        <thead>
          <tr>
            {[["id","ID"],["usuario_nombre","Usuario"],["total","Total"],["direccion_envio","Dirección"],["estado","Estado"]].map(([campo, label]) => (
              <th key={campo} onClick={() => ordenar(campo)} style={{ cursor: "pointer", userSelect: "none" }}>
                {label} {orden.campo === campo ? (orden.dir === "asc" ? "↑" : "↓") : "↕"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cargando ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                <Spinner animation="grow" style={{ color: "var(--gold)" }} />
              </td>
            </tr>
          ) : pedidosOrdenados.map((p) => (
            <tr key={p.id}>
              <td style={{ color: "var(--t2)" }}>#{p.id}</td>
              <td style={{ fontWeight: 600 }}>{p.usuario_nombre || `Usuario #${p.usuario_id}`}</td>
              <td><span className="text-gold fw-bold">${p.total.toLocaleString()}</span></td>
              <td style={{ color: "var(--t2)", fontSize: "0.85rem" }}>{p.direccion_envio}</td>
              <td>
                <select
                  value={p.estado}
                  onChange={(e) => actualizarEstado(p.id, e.target.value)}
                  style={estadoStyle(p.estado)}
                >
                  {["pendiente", "pagado", "enviado", "entregado", "cancelado"].map((e) => (
                    <option key={e} value={e} style={{ background: "var(--bg-3)", color: "var(--t1)" }}>
                      {e}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}