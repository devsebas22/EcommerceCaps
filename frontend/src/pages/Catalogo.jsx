import React, { useState, useEffect, useRef } from "react";
import { Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import AdminProductForm from "../components/AdminProductForm";
import Toast from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import FiltroProductos from "../components/FiltroProductos";

const API_BASE = import.meta.env.VITE_API_URL;

// ─── Secciones de confianza ──────────────────────────────────────────────────

const TRUST_ITEMS = [
  {
    text: "Envíos a toda Colombia",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    text: "Compra 100% segura",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    text: "Atención por WhatsApp",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    text: "Devoluciones garantizadas",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/>
      </svg>
    ),
  },
];

const TrustBanner = () => (
  <div style={{
    display: "flex",
    background: "#F5F5F7",
    borderRadius: "var(--r3)",
    marginBottom: "32px",
    overflowX: "auto",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
  }}>
    {TRUST_ITEMS.map((item, i) => (
      <div key={i} style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: "14px 24px",
        flexShrink: 0,
        flex: "1 0 auto",
        borderRight: i < TRUST_ITEMS.length - 1 ? "1px solid var(--border)" : "none",
        color: "var(--t1)",
      }}>
        {item.icon}
        <span style={{ color: "var(--t2)", fontSize: "0.78rem", fontWeight: 500, whiteSpace: "nowrap" }}>
          {item.text}
        </span>
      </div>
    ))}
  </div>
);

const WHY_ITEMS = [
  {
    title: "Calidad Premium",
    desc: "Seleccionamos cada producto con los más altos estándares de calidad",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    title: "Pago Seguro",
    desc: "Procesado por Wompi, la plataforma más segura de Colombia",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    title: "Envío Rápido",
    desc: "Despachamos en 24-48 horas a todo el país",
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

const WhyUs = () => (
  <div style={{ marginTop: "64px", paddingTop: "48px", borderTop: "1px solid var(--border)" }}>
    <h3 style={{ textAlign: "center", fontWeight: 800, fontSize: "1.25rem", margin: "0 0 6px", color: "var(--t1)" }}>
      ¿Por qué elegirnos?
    </h3>
    <div style={{ width: "28px", height: "2px", background: "var(--t1)", margin: "0 auto 36px", borderRadius: "2px" }} />
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {WHY_ITEMS.map((item, i) => (
        <div key={i} style={{
          flex: "1 1 200px",
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          borderRadius: "var(--r3)",
          padding: "32px 24px",
          textAlign: "center",
          boxShadow: "var(--sh-sm)",
        }}>
          <div style={{ color: "var(--t1)", display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            {item.icon}
          </div>
          <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--t1)", margin: "0 0 8px" }}>
            {item.title}
          </p>
          <p style={{ color: "var(--t2)", fontSize: "0.82rem", lineHeight: 1.65, margin: 0 }}>
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function Catalogo({ usuario, onCarritoChange, esAdmin = false, reloadTrigger = 0 }) {
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
  const [filtrandoSkeleton, setFiltrandoSkeleton] = useState(false);
  const filterTimer = useRef(null);
  const filterInitialized = useRef(false);

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

  useEffect(() => {
    if (reloadTrigger === 0) return;
    fetch(`${API_BASE}/productos/`)
      .then((r) => r.json())
      .then(setProductos)
      .catch(() => {});
  }, [reloadTrigger]);

  useEffect(() => {
    if (!filterInitialized.current) { filterInitialized.current = true; return; }
    if (cargando) return;
    clearTimeout(filterTimer.current);
    setFiltrandoSkeleton(true);
    filterTimer.current = setTimeout(() => setFiltrandoSkeleton(false), 350);
    return () => clearTimeout(filterTimer.current);
  }, [busqueda, categoriaFiltro, precioMax, busquedaId]);

  const agregarAlCarrito = async (producto) => {
    if (!usuario) { navigate("/login"); return; }
    setAgregando(true);
    try {
      await authFetch(`${API_BASE}/carrito/${usuario.id}`, {
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
    await authFetch(`${API_BASE}/productos/${confirmEliminar.id}`, { method: "DELETE" });
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
    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="col">
          <div style={{ background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ height: "215px" }} className="skeleton-shimmer" />
            <div style={{ padding: "18px 20px" }}>
              <div style={{ height: "10px", width: "55px", borderRadius: "5px", marginBottom: "12px" }} className="skeleton-shimmer" />
              <div style={{ height: "16px", width: "80%", borderRadius: "6px", marginBottom: "6px" }} className="skeleton-shimmer" />
              <div style={{ height: "12px", width: "45%", borderRadius: "5px", marginBottom: "24px" }} className="skeleton-shimmer" />
              <div style={{ height: "38px", borderRadius: "10px" }} className="skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </Row>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--err)", fontSize: "0.9rem" }}>
      Error al cargar productos: {error}
    </div>
  );

  const relacionados = sel && !esAdmin
    ? productos.filter(p => p.categoria_id === sel.categoria_id && p.id !== sel.id).slice(0, 3)
    : [];

  return (
    <>
      {!esAdmin && <TrustBanner />}

      {/* Fila 1: Heading + botones admin */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ color: "var(--t2)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", margin: "0 0 6px" }}>
            Colección actual
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 800, fontSize: "1.75rem", margin: 0 }}>
            Nuestros Productos
          </h2>
          <div className="heading-line" />
        </div>
        {esAdmin && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setVistaLista(false)}
              style={{
                background: !vistaLista ? "#1D1D1F" : "#FFFFFF",
                border: `1px solid ${!vistaLista ? "#1D1D1F" : "var(--border-md)"}`,
                color: !vistaLista ? "#FFFFFF" : "var(--t2)",
                borderRadius: "var(--r1)",
                padding: "7px 12px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "inherit",
                fontWeight: !vistaLista ? 600 : 400,
                transition: "all .15s",
              }}
              onMouseOver={e => { if (vistaLista) { e.currentTarget.style.borderColor = "#1D1D1F"; e.currentTarget.style.color = "var(--t1)"; } }}
              onMouseOut={e => { if (vistaLista) { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.color = "var(--t2)"; } }}
            >
              Cards
            </button>
            <button
              onClick={() => setVistaLista(true)}
              style={{
                background: vistaLista ? "#1D1D1F" : "#FFFFFF",
                border: `1px solid ${vistaLista ? "#1D1D1F" : "var(--border-md)"}`,
                color: vistaLista ? "#FFFFFF" : "var(--t2)",
                borderRadius: "var(--r1)",
                padding: "7px 12px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontFamily: "inherit",
                fontWeight: vistaLista ? 600 : 400,
                transition: "all .15s",
              }}
              onMouseOver={e => { if (!vistaLista) { e.currentTarget.style.borderColor = "#1D1D1F"; e.currentTarget.style.color = "var(--t1)"; } }}
              onMouseOut={e => { if (!vistaLista) { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.color = "var(--t2)"; } }}
            >
              Lista
            </button>
            <Button className="btn-theme-primary" onClick={abrirNuevo}>
              + Nuevo Producto
            </Button>
          </div>
        )}
      </div>

      {/* Fila 2: Filtros */}
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

      {esAdmin && <Toast mensaje={mensajeAdmin} />}
      {!esAdmin && <Toast mensaje={toastCarrito} />}

      <ConfirmModal
        show={!!confirmEliminar}
        titulo="Eliminar Producto"
        mensaje={`¿Eliminar "${confirmEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminarProducto}
        onCancelar={() => setConfirmEliminar(null)}
      />

      {filtrandoSkeleton ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col">
              <div style={{ background: "#FFFFFF", border: "1px solid #E8E8ED", borderRadius: "16px", overflow: "hidden" }}>
                <div style={{ height: "215px" }} className="skeleton-shimmer" />
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ height: "10px", width: "55px", borderRadius: "5px", marginBottom: "12px" }} className="skeleton-shimmer" />
                  <div style={{ height: "16px", width: "80%", borderRadius: "6px", marginBottom: "6px" }} className="skeleton-shimmer" />
                  <div style={{ height: "12px", width: "45%", borderRadius: "5px", marginBottom: "24px" }} className="skeleton-shimmer" />
                  <div style={{ height: "38px", borderRadius: "10px" }} className="skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </Row>
      ) : productosFiltrados.length === 0 ? (
        <p style={{ color: "var(--t2)", textAlign: "center", paddingTop: "60px" }}>
          No hay productos disponibles.
        </p>
      ) : vistaLista && esAdmin ? (
        <div className="table-scroll-wrap" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--r3)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--t1)", fontSize: "0.9rem", minWidth: "660px" }}>
            <thead>
              <tr style={{ background: "var(--bg-4)" }}>
                {[["id","ID",""],["nombre","Nombre",""],["categoria","Categoría",""],["precio","Precio",""],["stock","Stock",""],["marca","Marca","hide-mobile"]].map(([campo, label, cls]) => (
                  <th key={campo}
                    className={cls}
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
                    <span style={{ color: "var(--t1)", fontWeight: 700 }}>${p.precio.toLocaleString()}</span>
                  </td>
                  <td style={{ padding: "14px 18px", color: p.stock > 5 ? "var(--ok)" : p.stock > 0 ? "var(--warn)" : "var(--err)", fontWeight: 700 }}>
                    {p.stock} uds
                  </td>
                  <td className="hide-mobile" style={{ padding: "14px 18px", color: "var(--t2)" }}>{p.marca}</td>
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => abrirEditar(p)}
                        style={{ background: "none", border: "1px solid var(--warn)", color: "var(--warn)", borderRadius: "var(--r1)", padding: "5px 10px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(p.id)}
                        style={{ background: "none", border: "1px solid var(--err)", color: "var(--err)", borderRadius: "var(--r1)", padding: "5px 10px", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit" }}
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
        relacionados={relacionados}
        onVerRelacionado={setSel}
      />

      <AdminProductForm
        show={modalProducto}
        onHide={() => setModalProducto(false)}
        productoEditando={productoEditando}
        onSuccess={handleFormSuccess}
      />

      {!esAdmin && <WhyUs />}
    </>
  );
}
