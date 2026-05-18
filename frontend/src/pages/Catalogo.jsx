import React, { useState, useEffect } from "react";
import { Row, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import AdminProductForm from "../components/AdminProductForm";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import FiltroProductos from "../components/FiltroProductos";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Catalogo({ usuario, onCarritoChange, esAdmin = false }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sel, setSel] = useState(null);
  const [agregando, setAgregando] = useState(false);
  const [agregadoId, setAgregadoId] = useState(null);
  const [modalProducto, setModalProducto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mensajeAdmin, setMensajeAdmin] = useState(null);
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [vistaLista, setVistaLista] = useState(false);
  const [ordenLista, setOrdenLista] = useState({ campo: "id", dir: "asc" });
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [toastCarrito, setToastCarrito] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/categorias/`)
      .then(r => r.json())
      .then(setCategorias);
  }, []);
  useEffect(() => {
    let ok = true;
    fetch(`${API_BASE}/productos/`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { if (ok) setProductos(d); })
      .catch((e) => { if (ok) setError(e.message); })
      .finally(() => ok && setCargando(false));
    return () => (ok = false);
  }, []);

  const agregarAlCarrito = async (producto) => {
    if (!usuario) { navigate("/login"); return; }
    setAgregando(true);
    try {
      await fetch(`${API_BASE}/carrito/${usuario.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: producto.id, cantidad: 1 }),
      });
      setAgregadoId(producto.id);
      onCarritoChange?.();
      setToastCarrito({ tipo: "ok", texto: `${producto.nombre} agregado al carrito` });
      setTimeout(() => setAgregadoId(null), 2000);
      setTimeout(() => setToastCarrito(null), 2500);
    } finally {
      setAgregando(false);
    }
  };

  const abrirEditar = (producto) => {
    setProductoEditando(producto);
    setModalProducto(true);
  };

  const abrirNuevo = () => {
    setProductoEditando(null);
    setModalProducto(true);
  };

  const eliminarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setConfirmEliminar({ id, nombre: producto?.nombre ?? `#${id}` });
  };

  const confirmarEliminarProducto = async () => {
    await fetch(`${API_BASE}/productos/${confirmEliminar.id}`, { method: "DELETE" });
    setProductos((prev) => prev.filter((p) => p.id !== confirmEliminar.id));
    setConfirmEliminar(null);
  };

  const recargarProductos = async () => {
    const res = await fetch(`${API_BASE}/productos/`);
    setProductos(await res.json());
  };

  const handleFormSuccess = (mensaje) => {
    recargarProductos();
    setMensajeAdmin(mensaje);
    setTimeout(() => setMensajeAdmin(null), 3000);
  };
  const productosFiltrados = productos.filter((p) => {
  const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
  const matchCategoria = !categoriaFiltro || p.categoria_id === parseInt(categoriaFiltro);
  const matchPrecio = !precioMax || p.precio <= parseInt(precioMax);
  const matchId = !busquedaId || p.id === parseInt(busquedaId);
  return matchBusqueda && matchCategoria && matchPrecio && matchId;
});
  const ordenarLista = (campo) => {
  setOrdenLista((prev) => ({
    campo,
    dir: prev.campo === campo && prev.dir === "asc" ? "desc" : "asc"
  }));
};

const productosOrdenados = [...productosFiltrados].sort((a, b) => {
  const val = ordenLista.dir === "asc" ? 1 : -1;
  const aVal = ordenLista.campo === "categoria" ? a.categoria?.nombre : a[ordenLista.campo];
  const bVal = ordenLista.campo === "categoria" ? b.categoria?.nombre : b[ordenLista.campo];
  if (aVal < bVal) return -val;
  if (aVal > bVal) return val;
  return 0;
});

  if (cargando) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", gap: "16px" }}>
      <Spinner animation="grow" style={{ color: "var(--gold)", width: "2.2rem", height: "2.2rem" }} />
      <span style={{ color: "var(--t2)", fontSize: "0.82rem", letterSpacing: "0.5px" }}>Cargando colección…</span>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--err)", fontSize: "0.9rem" }}>
      Error al cargar productos: {error}
    </div>
  );

  return (
    <>
      <div style={{ marginBottom: "44px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--t2)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", margin: "0 0 6px" }}>
            Colección actual
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>
            Nuestros Productos
          </h2>
          <div className="heading-line" />
        </div>
        <FiltroProductos
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            categoriaFiltro={categoriaFiltro}
            setCategoriaFiltro={setCategoriaFiltro}
            precioMax={precioMax}
            setPrecioMax={setPrecioMax}
            categorias={categorias}
            esAdmin={esAdmin}
            busquedaId={busquedaId}
            setBusquedaId={setBusquedaId}
          />
        {esAdmin && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                onClick={() => setVistaLista(false)}
                style={{
                  background: !vistaLista ? "var(--gold-glow)" : "none",
                  border: `1px solid ${!vistaLista ? "var(--gold)" : "var(--border-md)"}`,
                  color: !vistaLista ? "var(--gold)" : "var(--t2)",
                  borderRadius: "var(--r1)",
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "inherit"
                }}
              >
                🔲 Cards
              </button>
              <button
                onClick={() => setVistaLista(true)}
                style={{
                  background: vistaLista ? "var(--gold-glow)" : "none",
                  border: `1px solid ${vistaLista ? "var(--gold)" : "var(--border-md)"}`,
                  color: vistaLista ? "var(--gold)" : "var(--t2)",
                  borderRadius: "var(--r1)",
                  padding: "7px 12px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontFamily: "inherit"
                }}
              >
                ☰ Lista
              </button>
              <Button className="btn-theme-primary" onClick={abrirNuevo}>
                + Nuevo Producto
              </Button>
            </div>
          )}  
        
      </div>

      {esAdmin && <Toast mensaje={mensajeAdmin} />}
      {!esAdmin && <Toast mensaje={toastCarrito} />}

      <ConfirmModal
        show={!!confirmEliminar}
        titulo="Eliminar Producto"
        mensaje={`¿Eliminar "${confirmEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminarProducto}
        onCancelar={() => setConfirmEliminar(null)}
      />

      {productosFiltrados.length === 0 ? (
        <p style={{ color: "var(--t2)", textAlign: "center", paddingTop: "60px" }}>
          No hay productos disponibles.
        </p>
      ) : vistaLista && esAdmin ? (
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--t1)", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-4)" }}>
                {[["id","ID"],["nombre","Nombre"],["categoria","Categoría"],["precio","Precio"],["stock","Stock"],["marca","Marca"]].map(([campo, label]) => (
                  <th key={campo} 
                    onClick={() => ordenarLista(campo)}
                    style={{ padding: "13px 18px", textAlign: "left", color: "var(--t2)", fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.9px", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none" }}>
                    {label} {ordenLista.campo === campo ? (ordenLista.dir === "asc" ? "↑" : "↓") : "↕"}
                  </th>
                ))}
                <th style={{ padding: "13px 18px", color: "var(--t2)", fontSize: "0.70rem", fontWeight: 700, textTransform: "uppercase" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosOrdenados.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 18px", color: "var(--t2)" }}>#{p.id}</td>
                  <td style={{ padding: "14px 18px", fontWeight: 600 }}>{p.nombre}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <span className="badge-cat">{p.categoria?.nombre}</span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    <span className="text-gold fw-bold">${p.precio.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: "14px 18px", color: p.stock > 5 ? "var(--ok)" : p.stock > 0 ? "var(--warn)" : "var(--err)", fontWeight: 700 }}>
                    {p.stock} uds
                  </td>
                  <td style={{ padding: "14px 18px", color: "var(--t2)" }}>{p.marca}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => abrirEditar(p)}
                        style={{ background: "none", border: "1px solid var(--warn)", color: "var(--warn)", borderRadius: "var(--r1)", padding: "5px 12px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(p.id)}
                        style={{ background: "none", border: "1px solid var(--err)", color: "var(--err)", borderRadius: "var(--r1)", padding: "5px 12px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {productosFiltrados.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              esAdmin={esAdmin}
              agregadoId={agregadoId}
              agregando={agregando}
              onVer={setSel}
              onAgregarAlCarrito={agregarAlCarrito}
              onEditar={abrirEditar}
              onEliminar={eliminarProducto}
            />
          ))}
        </Row>
      )}

      <ProductModal
        producto={sel}
        esAdmin={esAdmin}
        onClose={() => setSel(null)}
        onAgregarAlCarrito={agregarAlCarrito}
      />

      <AdminProductForm
        show={modalProducto}
        onHide={() => setModalProducto(false)}
        productoEditando={productoEditando}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
