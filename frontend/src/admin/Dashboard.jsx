import React, { useState, useEffect } from "react";
import { Container, Nav, Button, Table, Badge, Spinner } from "react-bootstrap";
import Catalogo from "../Catalogo";

const API_BASE = "http://127.0.0.1:8000";

export default function Dashboard({ admin, onLogout }) {
  const [vista, setVista] = useState("productos");
  const [stats, setStats] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarStats();
  }, []);

  useEffect(() => {
    if (vista === "usuarios") cargarUsuarios();
    if (vista === "pedidos") cargarPedidos();
  }, [vista]);

  const cargarStats = async () => {
    const res = await fetch(`${API_BASE}/stats/`);
    const data = await res.json();
    setStats(data);
  };

  const cargarUsuarios = async () => {
    setCargando(true);
    const res = await fetch(`${API_BASE}/usuarios/`);
    const data = await res.json();
    setUsuarios(data);
    setCargando(false);
  };

  const cargarPedidos = async () => {
    setCargando(true);
    const res = await fetch(`${API_BASE}/pedidos/todos/`);
    const data = await res.json();
    setPedidos(data);
    setCargando(false);
  };

  const estadoColor = {
    pendiente: "warning",
    pagado: "success",
    enviado: "info",
    entregado: "success",
    cancelado: "danger"
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)" }}>
      {/* Topbar */}
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="admin-brand">ECOMMERCE CAPS</span>
          <div className="admin-nav-pill">
            {["productos", "usuarios", "pedidos"].map((v) => (
              <button
                key={v}
                className={`admin-nav-item${vista === v ? " active" : ""}`}
                onClick={() => setVista(v)}
              >
                {v === "productos" ? "📦 Productos" : v === "usuarios" ? "👥 Usuarios" : "📋 Pedidos"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
            Hola, <span className="text-gold fw-semibold">{admin.nombre}</span>
          </span>
          <Button variant="outline-danger" size="sm" onClick={onLogout}
            style={{ borderRadius: "8px", fontSize: "0.8rem", padding: "6px 16px" }}>
            Salir
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", padding: "24px 28px 0" }}>
          {[
            { label: "Productos", value: stats.total_productos, color: "var(--gold)" },
            { label: "Usuarios", value: stats.total_usuarios, color: "var(--ok)" },
            { label: "Pedidos", value: stats.total_pedidos, color: "#60a5fa" },
            { label: "Sin stock", value: stats.productos_sin_stock, color: "var(--err)" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "20px 24px" }}>
              <p style={{ color: "var(--t2)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 8px" }}>{s.label}</p>
              <p style={{ color: s.color, fontSize: "2rem", fontWeight: 800, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Contenido */}
      <Container fluid className="py-4 px-4">
        {/* Productos */}
        {vista === "productos" && (
          <Catalogo usuario={admin} onCarritoChange={() => {}} esAdmin={true} />
        )}

        {/* Usuarios */}
        {vista === "usuarios" && (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden" }}>
            <Table className="table-admin" responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Puntos</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan={6} className="text-center py-4"><Spinner animation="grow" style={{ color: "var(--gold)" }} /></td></tr>
                ) : usuarios.map((u) => (
                  <tr key={u.id}>
                    <td style={{ color: "var(--t2)" }}>#{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.nombre}</td>
                    <td style={{ color: "var(--t2)" }}>{u.email}</td>
                    <td style={{ color: "var(--t2)" }}>{u.telefono || "—"}</td>
                    <td><span className="text-gold fw-bold">{u.puntos_fidelidad}</span></td>
                    <td>
                      <Badge bg={u.es_admin ? "warning" : "secondary"} style={{ color: u.es_admin ? "#000" : "#fff" }}>
                        {u.es_admin ? "Admin" : "Cliente"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Pedidos */}
        {vista === "pedidos" && (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden" }}>
            <Table className="table-admin" responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan={5} className="text-center py-4"><Spinner animation="grow" style={{ color: "var(--gold)" }} /></td></tr>
                ) : pedidos.map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: "var(--t2)" }}>#{p.id}</td>
                    <td style={{ fontWeight: 600 }}>Usuario #{p.usuario_id}</td>
                    <td><span className="text-gold fw-bold">${p.total.toLocaleString()}</span></td>
                    <td style={{ color: "var(--t2)", fontSize: "0.85rem" }}>{p.direccion_envio}</td>
                    <td>
                      <select
                        value={p.estado}
                        onChange={async (e) => {
                          await fetch(`${API_BASE}/pedidos/${p.id}/estado`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ estado: e.target.value }),
                          });
                          cargarPedidos();
                        }}
                        style={{
                          background: p.estado === "pendiente" ? "rgba(251,191,36,.12)" :
                                      p.estado === "pagado"    ? "rgba(52,211,153,.12)" :
                                      p.estado === "enviado"   ? "rgba(96,165,250,.12)" :
                                      p.estado === "entregado" ? "rgba(52,211,153,.20)" :
                                      "rgba(248,113,113,.12)",
                          border: `1px solid ${
                                      p.estado === "pendiente" ? "rgba(251,191,36,.35)" :
                                      p.estado === "pagado"    ? "rgba(52,211,153,.35)" :
                                      p.estado === "enviado"   ? "rgba(96,165,250,.35)" :
                                      p.estado === "entregado" ? "rgba(52,211,153,.50)" :
                                      "rgba(248,113,113,.35)"}`,
                          color: p.estado === "pendiente" ? "var(--warn)" :
                                p.estado === "pagado"    ? "var(--ok)" :
                                p.estado === "enviado"   ? "#60a5fa" :
                                p.estado === "entregado" ? "var(--ok)" :
                                "var(--err)",
                          borderRadius: "var(--r1)",
                          padding: "5px 10px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
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
        )}
      </Container>
    </div>
  );
}