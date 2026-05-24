import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/api";
import { calcularFirma } from "../utils/wompi";

const API_BASE = import.meta.env.VITE_API_URL;

const ESTADO_STYLE = {
  pendiente: { background: "#FFF8EE", border: "1px solid #FF9F0A", color: "#BF6900" },
  pagado:    { background: "#F0FAF4", border: "1px solid #30D158", color: "#1A7F37" },
  enviado:   { background: "#EEF4FF", border: "1px solid #0A84FF", color: "#0A6FBB" },
  entregado: { background: "#E8F8EE", border: "1px solid #25A844", color: "#1A6B30" },
  cancelado: { background: "#FFF2F1", border: "1px solid #FF3B30", color: "#CC2D22" },
};

const estadoStyle = (estado) => ({
  ...(ESTADO_STYLE[estado] ?? ESTADO_STYLE.cancelado),
  borderRadius: "8px",
  padding: "5px 10px",
  fontSize: "0.8rem",
  fontWeight: 600,
  display: "inline-block",
});

const productoStyle = {
  display: "flex", alignItems: "center", gap: "12px", padding: "10px 0",
  borderBottom: "1px solid var(--border)",
};

export default function MisPedidos({ usuario }) {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [expandido, setExpandido] = useState(null);
  const [pagandoId, setPagandoId] = useState(null);
  const [errorPagoId, setErrorPagoId] = useState(null);

  useEffect(() => {
    if (!usuario) { navigate("/login"); return; }
    cargarPedidos();
  }, [usuario]);

  const cargarPedidos = async () => {
    setCargando(true);
    try {
      const res = await authFetch(`${API_BASE}/pedidos/historial/${usuario.id}`);
      if (res.ok) setPedidos(await res.json());
    } catch {}
    setCargando(false);
  };

  const pagarPedido = async (pedido) => {
    if (!window.WidgetCheckout) {
      setErrorPagoId(pedido.id);
      setTimeout(() => setErrorPagoId(null), 4000);
      return;
    }
    setPagandoId(pedido.id);
    setErrorPagoId(null);
    try {
      const reference = `pedido-${pedido.id}`;
      const amountInCents = Math.round(pedido.total * 100);
      const signature = await calcularFirma(reference, amountInCents);

      const checkout = new window.WidgetCheckout({
        currency: "COP",
        amountInCents,
        reference,
        publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
        signature: { integrity: signature },
        redirectUrl: `${window.location.origin}/mis-pedidos`,
        customerData: {
          email: usuario.email,
          fullName: usuario.nombre,
        },
      });

      checkout.open(async (result) => {
        setPagandoId(null);
        if (result.transaction.status === "APPROVED") {
          await authFetch(`${API_BASE}/pedidos/${pedido.id}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "pagado" }),
          });
          cargarPedidos();
        } else {
          setErrorPagoId(pedido.id);
          setTimeout(() => setErrorPagoId(null), 4000);
        }
      });
    } catch {
      setPagandoId(null);
      setErrorPagoId(pedido.id);
      setTimeout(() => setErrorPagoId(null), 4000);
    }
  };

  if (!usuario) return null;

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: "820px" }}>
        <div className="text-center mb-5">
          <p className="navbar-brand-theme" style={{ fontSize: "1.05rem", letterSpacing: "2px", marginBottom: "10px" }}>
            CAPSCO
          </p>
          <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.5rem", margin: "0 0 6px" }}>
            Mis Pedidos
          </h2>
        </div>

        {cargando ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: "#FFFFFF", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "24px", boxShadow: "var(--sh-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ height: "16px", width: "120px", borderRadius: "6px" }} className="skeleton-shimmer" />
                  <div style={{ height: "28px", width: "90px", borderRadius: "8px" }} className="skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : pedidos.length === 0 ? (
          <div style={{
            background: "#FFFFFF",
            border: "1px solid var(--border)",
            borderRadius: "var(--r3)",
            padding: "60px 36px",
            textAlign: "center",
            boxShadow: "var(--sh-sm)",
          }}>
            <p style={{ color: "var(--t2)", fontSize: "1rem", margin: 0 }}>
              No has realizado ningún pedido aún.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {pedidos.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r3)",
                  padding: "24px",
                  boxShadow: "var(--sh-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: "12px", cursor: "pointer",
                  }}
                  onClick={() => setExpandido(expandido === p.id ? null : p.id)}
                >
                  <div>
                    <span style={{ color: "var(--t2)", fontSize: "0.85rem" }}>Pedido #</span>
                    <span style={{ color: "var(--t1)", fontWeight: 700 }}>{p.id}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={estadoStyle(p.estado)}>{p.estado}</span>
                    <span style={{ color: "var(--t1)", fontWeight: 800, fontSize: "1rem" }}>${p.total.toLocaleString()}</span>
                    {p.estado === "pendiente" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); pagarPedido(p); }}
                        disabled={pagandoId === p.id}
                        style={{
                          background: "#1D1D1F",
                          border: "none",
                          color: "#FFFFFF",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: pagandoId === p.id ? "not-allowed" : "pointer",
                          opacity: pagandoId === p.id ? 0.6 : 1,
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pagandoId === p.id ? "Abriendo…" : "Pagar ahora"}
                      </button>
                    )}
                  </div>
                </div>

                {errorPagoId === p.id && (
                  <div style={{
                    background: "#FFF2F1",
                    border: "1px solid #FF3B30",
                    borderRadius: "var(--r2)",
                    padding: "8px 14px",
                    marginBottom: "10px",
                    fontSize: "0.82rem",
                    color: "#CC2D22",
                  }}>
                    {window.WidgetCheckout ? "El pago no fue aprobado. Intenta de nuevo." : "El sistema de pagos no está disponible. Recarga la página."}
                  </div>
                )}

                {expandido === p.id && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                    {p.estado === "cancelado" && (
                      <div style={{
                        background: "#FFF2F1",
                        border: "1px solid #FF3B30",
                        borderRadius: "var(--r2)",
                        padding: "12px 16px",
                        marginBottom: "12px",
                        textAlign: "center",
                      }}>
                        <span style={{ color: "#CC2D22", fontWeight: 700, fontSize: "0.9rem" }}>
                          Pedido cancelado — Capital devuelto
                        </span>
                      </div>
                    )}
                    <p style={{ color: "var(--t2)", fontSize: "0.8rem", marginBottom: "8px" }}>
                      Dirección de envío: <span style={{ color: "var(--t1)" }}>{p.direccion_envio}</span>
                    </p>
                    {p.items && p.items.length > 0 && (
                      <div>
                        <p style={{ color: "var(--t3)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: "8px" }}>
                          Productos
                        </p>
                        {p.items.map((item) => (
                          <div key={item.id} style={productoStyle}>
                            <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--bg-1)", overflow: "hidden", flexShrink: 0 }}>
                              {(() => {
                                const img = item.producto?.imagenes?.find(i => i.es_principal)?.url ?? item.producto?.imagenes?.[0]?.url;
                                return img ? <img src={img} alt={item.producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null;
                              })()}
                            </div>
                            <div style={{ flex: 1 }}>
                              <span style={{ color: "var(--t1)", fontSize: "0.88rem", fontWeight: 600 }}>
                                {item.producto?.nombre || `Producto #${item.producto_id}`}
                              </span>
                            </div>
                            <span style={{ color: "var(--t2)", fontSize: "0.82rem" }}>x{item.cantidad}</span>
                            <span style={{ color: "var(--t1)", fontWeight: 600, fontSize: "0.88rem", minWidth: "70px", textAlign: "right" }}>
                              ${(item.precio_unitario * item.cantidad).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {expandido !== p.id && (
                  <>
                    {p.estado === "cancelado" && (
                      <p style={{ color: "#CC2D22", fontSize: "0.78rem", margin: "4px 0 0" }}>
                        Pedido cancelado — Capital devuelto
                      </p>
                    )}
                    <p style={{ color: "var(--t3)", fontSize: "0.78rem", margin: p.estado === "cancelado" ? "2px 0 0" : "4px 0 0", cursor: "pointer" }}
                       onClick={() => setExpandido(p.id)}>
                      Ver detalle ▾
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
