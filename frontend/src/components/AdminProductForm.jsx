import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { authFetch } from "../utils/api";

const API_BASE = import.meta.env.VITE_API_URL;
const FORM_VACIO = { nombre: "", descripcion: "", precio: "", marca: "", stock: "", categoria_id: "", archivo: null };

export default function AdminProductForm({ show, onHide, productoEditando, onSuccess }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  useEffect(() => {
    if (!show) return;
    fetch(`${API_BASE}/categorias/`).then((r) => r.json()).then(setCategorias);
    setForm(
      productoEditando
        ? {
            nombre: productoEditando.nombre,
            descripcion: productoEditando.descripcion || "",
            precio: productoEditando.precio,
            marca: productoEditando.marca,
            stock: productoEditando.stock,
            categoria_id: productoEditando.categoria_id,
            archivo: null,
          }
        : FORM_VACIO
    );
    if (productoEditando) {
      cargarImagenes(productoEditando.id);
    } else {
      setImagenes([]);
    }
  }, [show, productoEditando]);

  const cargarImagenes = async (productoId) => {
    try {
      const res = await fetch(`${API_BASE}/imagenes/${productoId}`);
      if (res.ok) setImagenes(await res.json());
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      marca: form.marca,
      stock: parseInt(form.stock),
      categoria_id: parseInt(form.categoria_id),
    };

    const url = productoEditando
      ? `${API_BASE}/productos/${productoEditando.id}`
      : `${API_BASE}/productos/`;
    const method = productoEditando ? "PUT" : "POST";

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();

      if (form.archivo) {
        const formData = new FormData();
        formData.append("image", form.archivo);
        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
          { method: "POST", body: formData }
        );
        const imgData = await imgRes.json();
        if (imgData.success) {
          const esPrincipal = imagenes.length === 0;
          await authFetch(`${API_BASE}/imagenes/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: imgData.data.url, es_principal: esPrincipal, producto_id: data.id }),
          });
        }
      }

      onSuccess({ tipo: "ok", texto: productoEditando ? "Producto actualizado" : "Producto creado" });
      onHide();
    } else {
      const errData = await res.json();
      onSuccess({ tipo: "err", texto: errData.detail || "Error al guardar el producto" });
    }
  };

  const eliminarImagen = async (imagenId) => {
    const res = await authFetch(`${API_BASE}/imagenes/${imagenId}`, { method: "DELETE" });
    if (res.ok) setImagenes((prev) => prev.filter((i) => i.id !== imagenId));
  };

  const marcarPrincipal = async (imagenId) => {
    const res = await authFetch(`${API_BASE}/imagenes/${imagenId}/principal`, { method: "PUT" });
    if (res.ok) setImagenes((prev) => prev.map((i) => ({ ...i, es_principal: i.id === imagenId })));
  };

  const agregarImagen = async (archivo) => {
    if (!archivo || !productoEditando) return;
    setSubiendoImagen(true);
    try {
      const formData = new FormData();
      formData.append("image", archivo);
      const imgRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        { method: "POST", body: formData }
      );
      const imgData = await imgRes.json();
      if (!imgData.success) return;
      const esPrincipal = imagenes.length === 0;
      const res = await authFetch(`${API_BASE}/imagenes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imgData.data.url, es_principal: esPrincipal, producto_id: productoEditando.id }),
      });
      if (res.ok) {
        const nueva = await res.json();
        setImagenes((prev) => [...prev, nueva]);
      }
    } finally {
      setSubiendoImagen(false);
    }
  };

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <Modal show={show} onHide={onHide} centered className="modal-admin">
      <Modal.Header closeButton>
        <Modal.Title>{productoEditando ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Nombre</Form.Label>
            <Form.Control className="input-theme" value={form.nombre} onChange={set("nombre")} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Descripción</Form.Label>
            <Form.Control className="input-theme" as="textarea" rows={2} value={form.descripcion} onChange={set("descripcion")} />
          </Form.Group>
          <div className="d-flex gap-3">
            <Form.Group className="mb-3 flex-fill">
              <Form.Label className="label-theme">Precio</Form.Label>
              <Form.Control className="input-theme" type="number" value={form.precio} onChange={set("precio")} required />
            </Form.Group>
            <Form.Group className="mb-3 flex-fill">
              <Form.Label className="label-theme">Stock</Form.Label>
              <Form.Control className="input-theme" type="number" value={form.stock} onChange={set("stock")} required />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Marca</Form.Label>
            <Form.Control className="input-theme" value={form.marca} onChange={set("marca")} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="label-theme">Categoría</Form.Label>
            <Form.Select className="input-theme" value={form.categoria_id} onChange={set("categoria_id")} required>
              <option value="">Selecciona una categoría</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Form.Select>
          </Form.Group>

          {/* Gestión de imágenes — solo al editar */}
          {productoEditando && imagenes.length > 0 && (
            <div className="mb-3">
              <label className="label-theme">Imágenes actuales</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
                {imagenes.map((img) => (
                  <div key={img.id} style={{
                    position: "relative",
                    border: img.es_principal ? "2px solid #1D1D1F" : "1px solid var(--border-md)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    width: "80px",
                  }}>
                    <img src={img.url} alt="" style={{ width: "80px", height: "80px", objectFit: "cover", display: "block" }} />
                    {img.es_principal && (
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        background: "rgba(29,29,31,.75)", color: "#FFF",
                        fontSize: "0.58rem", fontWeight: 700, textAlign: "center",
                        padding: "2px", letterSpacing: "0.5px",
                      }}>
                        PRINCIPAL
                      </div>
                    )}
                    <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
                      {!img.es_principal && (
                        <button
                          type="button"
                          title="Marcar como principal"
                          onClick={() => marcarPrincipal(img.id)}
                          style={{
                            flex: 1, background: "none", border: "none",
                            fontSize: "0.7rem", cursor: "pointer", padding: "3px",
                            color: "var(--t2)", fontFamily: "inherit",
                          }}
                        >
                          ★
                        </button>
                      )}
                      <button
                        type="button"
                        title="Eliminar imagen"
                        onClick={() => eliminarImagen(img.id)}
                        style={{
                          flex: 1, background: "none", border: "none",
                          fontSize: "0.7rem", cursor: "pointer", padding: "3px",
                          color: "#CC2D22", fontFamily: "inherit",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subir nueva imagen */}
          <Form.Group className="mb-4">
            <Form.Label className="label-theme">
              {productoEditando ? "Agregar imagen" : "Imagen del producto"}
            </Form.Label>
            {productoEditando ? (
              <div>
                <label style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: subiendoImagen ? "var(--bg-1)" : "#FFFFFF",
                  border: "1px solid var(--border-md)",
                  borderRadius: "var(--r2)", padding: "9px 16px",
                  cursor: subiendoImagen ? "not-allowed" : "pointer",
                  fontSize: "0.84rem", color: "var(--t2)", fontFamily: "inherit",
                  transition: "border-color .15s",
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {subiendoImagen ? "Subiendo…" : "Seleccionar imagen"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    disabled={subiendoImagen}
                    onChange={(e) => { if (e.target.files[0]) agregarImagen(e.target.files[0]); e.target.value = ""; }}
                  />
                </label>
              </div>
            ) : (
              <>
                <Form.Control
                  className="input-theme"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((prev) => ({ ...prev, archivo: e.target.files[0] }))}
                />
                {form.archivo && (
                  <p style={{ color: "var(--t2)", fontSize: "0.78rem", marginTop: "6px" }}>
                    Seleccionado: {form.archivo.name}
                  </p>
                )}
              </>
            )}
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" className="btn-theme-primary">
              {productoEditando ? "Actualizar Producto" : "Crear Producto"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
