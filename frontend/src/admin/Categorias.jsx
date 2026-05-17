import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => { cargarCategorias(); }, []);

  const cargarCategorias = async () => {
    setCargando(true);
    const res = await fetch(`${API_BASE}/categorias/`);
    setCategorias(await res.json());
    setCargando(false);
  };

  const abrirNuevo = () => {
    setForm({ nombre: "", descripcion: "" });
    setEditando(null);
    setShowModal(true);
  };

  const abrirEditar = (cat) => {
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion || "" });
    setEditando(cat);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editando ? `${API_BASE}/categorias/${editando.id}` : `${API_BASE}/categorias/`;
    const method = editando ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMensaje({ tipo: "ok", texto: editando ? "Categoría actualizada" : "Categoría creada" });
      cargarCategorias();
      setShowModal(false);
    } else {
      const err = await res.json();
      setMensaje({ tipo: "err", texto: err.detail || "Error al guardar" });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.")) return;
    await fetch(`${API_BASE}/categorias/${id}`, { method: "DELETE" });
    cargarCategorias();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h5 style={{ color: "var(--t1)", fontWeight: 700, margin: 0 }}>Gestión de Categorías</h5>
        <Button className="btn-theme-primary" onClick={abrirNuevo}>+ Nueva Categoría</Button>
      </div>

      {mensaje && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px",
          background: mensaje.tipo === "ok" ? "rgba(52,211,153,.12)" : "rgba(248,113,113,.12)",
          border: `1px solid ${mensaje.tipo === "ok" ? "rgba(52,211,153,.35)" : "rgba(248,113,113,.35)"}`,
          color: mensaje.tipo === "ok" ? "var(--ok)" : "var(--err)",
          borderRadius: "var(--r2)", padding: "14px 20px",
          fontWeight: 600, fontSize: "0.88rem", zIndex: 9999
        }}>
          {mensaje.tipo === "ok" ? "✓" : "✕"} {mensaje.texto}
        </div>
      )}

      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden" }}>
        <Table className="table-admin" responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={4} className="text-center py-4"><Spinner animation="grow" style={{ color: "var(--gold)" }} /></td></tr>
            ) : categorias.map((c) => (
              <tr key={c.id}>
                <td style={{ color: "var(--t2)" }}>#{c.id}</td>
                <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                <td style={{ color: "var(--t2)", fontSize: "0.85rem" }}>{c.descripcion || "—"}</td>
                <td>
                  <Button size="sm" variant="outline-warning" className="me-2" onClick={() => abrirEditar(c)}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => eliminar(c.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="modal-admin">
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar Categoría" : "Nueva Categoría"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="label-theme">Nombre</Form.Label>
              <Form.Control className="input-theme" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="label-theme">Descripción</Form.Label>
              <Form.Control className="input-theme" as="textarea" rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" className="btn-theme-primary">
                {editando ? "Actualizar" : "Crear Categoría"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
