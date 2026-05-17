import React, { useState, useEffect } from "react";
import { Table, Badge, Spinner, Button } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Usuarios({ admin }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [orden, setOrden] = useState({ campo: "id", dir: "asc" });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const res = await fetch(`${API_BASE}/usuarios/`);
    setUsuarios(await res.json());
    setCargando(false);
  };

  const ordenar = (campo) => {
    setOrden((prev) => ({
      campo,
      dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc"
    }));
  };

  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    const val = orden.dir === "asc" ? 1 : -1;
    if (a[orden.campo] < b[orden.campo]) return -val;
    if (a[orden.campo] > b[orden.campo]) return val;
    return 0;
  });

  const eliminar = async (id, nombre) => {
    if (!confirm(`¿Eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`${API_BASE}/usuarios/${id}?admin_id=${admin.id}`, { method: "DELETE" });
    if (res.ok) {
      cargarUsuarios();
    } else {
      const err = await res.json();
      alert(err.detail ?? "Error al eliminar usuario");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
        <div>
          <h4 style={{ color: "var(--t1)", fontWeight: 800, margin: "0 0 6px", fontSize: "1.35rem" }}>Gestión de Usuarios</h4>
          <div className="heading-line" />
        </div>
      </div>
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden" }}>
        <Table className="table-admin" responsive>
          <thead>
            <tr>
              {[["id","ID"],["nombre","Nombre"],["email","Email"],["telefono","Teléfono"],["puntos_fidelidad","Puntos"],["es_admin","Rol"]].map(([campo, label]) => (
                <th key={campo} onClick={() => ordenar(campo)} style={{ cursor: "pointer", userSelect: "none" }}>
                  {label} {orden.campo === campo ? (orden.dir === "asc" ? "↑" : "↓") : "↕"}
                </th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <Spinner animation="grow" style={{ color: "var(--gold)" }} />
                </td>
              </tr>
            ) : usuariosOrdenados.map((u) => (
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
                <td>
                  {!u.es_admin && (
                    <Button size="sm" variant="outline-danger" style={{ borderRadius: "7px", fontSize: "0.76rem", padding: "5px 13px" }} onClick={() => eliminar(u.id, u.nombre)}>
                      Eliminar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}