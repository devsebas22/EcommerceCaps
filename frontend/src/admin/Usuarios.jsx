import React, { useState, useEffect } from "react";
import { Table, Badge, Spinner } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    const res = await fetch(`${API_BASE}/usuarios/`);
    setUsuarios(await res.json());
    setCargando(false);
  };

  return (
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
            <tr>
              <td colSpan={6} className="text-center py-4">
                <Spinner animation="grow" style={{ color: "var(--gold)" }} />
              </td>
            </tr>
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
  );
}
