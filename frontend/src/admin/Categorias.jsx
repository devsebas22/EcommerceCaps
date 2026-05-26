import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { authFetch } from "../utils/api";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [mensaje, setMensaje] = useState(null);
  const [orden, setOrden] = useState({ campo: "id", dir: "asc" });
  const [confirmData, setConfirmData] = useState(null);

  const flash = (tipo, texto) => { setMensaje({ tipo, texto }); setTimeout(() => setMensaje(null), 3200); };

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
    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      flash("ok", editando ? "Categoría actualizada" : "Categoría creada");
      cargarCategorias();
      setShowModal(false);
    } else {
      const err = await res.json();
      flash("err", err.detail || "Error al guardar");
    }
  };

  const eliminar = (id, nombre) => setConfirmData({ id, nombre });

  const confirmarEliminar = async () => {
    const res = await authFetch(`${API_BASE}/categorias/${confirmData.id}`, { method: "DELETE" });
    setConfirmData(null);
    if (res.ok) {
      flash("ok", "Categoría eliminada");
      cargarCategorias();
    } else {
      const err = await res.json();
      flash("err", err.detail || "No se puede eliminar la categoría");
    }
  };

  const ordenar = (campo) => {
    setOrden((prev) => ({ campo, dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc" }));
  };

  const categoriasOrdenadas = [...categorias].sort((a, b) => {
    const val = orden.dir === "asc" ? 1 : -1;
    if (a[orden.campo] < b[orden.campo]) return -val;
    if (a[orden.campo] > b[orden.campo]) return val;
    return 0;
  });

  const thStyle = { padding: "13px 18px", textAlign: "left", color: "var(--t2)", fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", background: "var(--bg-1)", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap" };
  const tdStyle = { padding: "14px 18px", verticalAlign: "middle", borderBottom: "1px solid var(--border)" };

  return (
    <div>
      <ConfirmModal
        show={!!confirmData}
        titulo="Eliminar Categoría"
        mensaje={`¿Eliminar "${confirmData?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setConfirmData(null)}
      />
      <Toast mensaje={mensaje} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <h4 style={{ color: "var(--t1)", fontWeight: 800, margin: "0 0 6px", fontSize: "1.25rem" }}>Categorías</h4>
          <div className="heading-line" />
        </div>
        <button
          onClick={abrirNuevo}
          style={{
            background: "#1D1D1F",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "10px",
            padding: "9px 20px",
            fontSize: "0.84rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          + Nueva Categoría
        </button>
      </div>

      <div className="table-scroll-wrap" style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "var(--r3)", boxShadow: "var(--sh-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              {[["id","ID",""],["nombre","Nombre",""],["descripcion","Descripción","hide-mobile"]].map(([campo, label, cls]) => (
                <th key={campo} className={cls} style={thStyle} onClick={() => ordenar(campo)}>
                  {label} {orden.campo === campo ? (orden.dir === "asc" ? "↑" : "↓") : <span style={{ opacity: 0.35 }}>↕</span>}
                </th>
              ))}
              <th style={{ ...thStyle, cursor: "default" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  {[1, 2, 3, 4].map((j) => (
                    <td key={j} style={{ ...tdStyle, padding: "20px 18px" }}>
                      <div style={{ height: "14px", borderRadius: "6px" }} className="skeleton-shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : categoriasOrdenadas.map((c) => (
              <tr key={c.id}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-1)"}
                onMouseOut={e => e.currentTarget.style.background = ""}
                style={{ transition: "background .1s" }}
              >
                <td style={{ ...tdStyle, color: "var(--t2)" }}>#{c.id}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{c.nombre}</td>
                <td className="hide-mobile" style={{ ...tdStyle, color: "var(--t2)", fontSize: "0.85rem" }}>{c.descripcion || "—"}</td>
                <td style={{ ...tdStyle, display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => abrirEditar(c)}
                    style={{
                      background: "none",
                      border: "1px solid var(--border-md)",
                      color: "var(--t1)",
                      borderRadius: "7px",
                      padding: "4px 14px",
                      fontSize: "0.80rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(c.id, c.nombre)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#CC2D22",
                      fontSize: "0.80rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      padding: "4px 0",
                      fontFamily: "inherit",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
