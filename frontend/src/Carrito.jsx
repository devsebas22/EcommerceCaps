import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Alert, Spinner } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_URL;

const imgPrincipal = (producto) =>
  producto.imagenes?.find((i) => i.es_principal)?.url ?? producto.imagenes?.[0]?.url ?? null;

const calcularFirma = async (reference, amountInCents) => {
  const integrityKey = import.meta.env.VITE_WOMPI_INTEGRITY_KEY;
  // amountInCents debe ser entero — Math.round evita "249000.0000001" en el hash
  const monto = Math.round(amountInCents);
  const cadena = `${reference}${monto}COP${integrityKey}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(cadena);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

/* ─── Checkout ─── */
function Checkout({ usuario, total, items, onClose, onSuccess, onUsuarioActualizado }) {
  const [direccion, setDireccion] = useState(usuario.direccion || "");
  const [cargando, setCargando] = useState(false);
  const [exitoso, setExitoso] = useState(false);
  const [error, setError] = useState(null);
  const [oculto, setOculto] = useState(false);
  const procesando = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!direccion.trim() || procesando.current) return;
    procesando.current = true;
    setCargando(true);
    setError(null);
    try {
      if (!window.WidgetCheckout) {
        setError("El sistema de pagos no está disponible. Recarga la página.");
        return;
      }
      const res = await fetch(`${API_BASE}/pedidos/${usuario.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direccion_envio: direccion }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Error al procesar el pedido");
        return;
      }
      const pedido = await res.json();

      const reference = `pedido-${pedido.id}`;
      const amountInCents = Math.round(pedido.total * 100); // entero, sin decimales flotantes
      const signature = await calcularFirma(reference, amountInCents);

      setOculto(true);

      const checkout = new window.WidgetCheckout({
        currency: "COP",
        amountInCents: amountInCents,
        reference: reference,
        publicKey: import.meta.env.VITE_WOMPI_PUBLIC_KEY,
        signature: { integrity: signature },
        customerData: {
          email: usuario.email,
          fullName: usuario.nombre,
        },
      });

      checkout.open((result) => {
        procesando.current = false;
        setOculto(false);
        if (result.transaction.status === "APPROVED") {
          fetch(`${API_BASE}/pedidos/${pedido.id}/estado`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estado: "pagado" }),
          }).then(() => {
            // Si la dirección ingresada es nueva, guardarla en el perfil
            if (direccion.trim() && direccion.trim() !== (usuario.direccion || "").trim()) {
              fetch(`${API_BASE}/usuarios/${usuario.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nombre: usuario.nombre,
                  email: usuario.email,
                  direccion: direccion.trim(),
                  telefono: usuario.telefono || "",
                }),
              }).then(() => {
                const actualizado = { ...usuario, direccion: direccion.trim() };
                localStorage.setItem("usuario", JSON.stringify(actualizado));
                onUsuarioActualizado?.(actualizado);
              });
            }
            setExitoso(true);
            setTimeout(onSuccess, 2800);
          });
        } else {
          setError("El pago no fue aprobado. Intenta de nuevo.");
        }
      });
    } catch {
      setError("Error de conexión con el servidor");
    } finally {
      procesando.current = false;
      setCargando(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0, 0, 0, 0.65)",
      display: oculto ? "none" : "flex",
      alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        background: "var(--bg-3)",
        border: "1px solid var(--border-md)",
        borderRadius: "var(--r4)",
        width: "100%", maxWidth: "420px",
        boxShadow: "var(--sh-lg)",
        overflow: "hidden",
      }}>
        <div style={{
          background: "var(--bg-4)",
          borderBottom: "1px solid var(--border)",
          padding: "18px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color: "var(--t1)", fontWeight: 700, fontSize: "0.95rem" }}>
            {exitoso ? "¡Pedido confirmado!" : "Finalizar Pedido"}
          </span>
          {!exitoso && (
            <button onClick={onClose} style={{
              background: "none", border: "none", color: "var(--t2)",
              fontSize: "1.1rem", cursor: "pointer", padding: "4px", lineHeight: 1,
            }}>✕</button>
          )}
        </div>

        <div style={{ padding: "24px" }}>
          {exitoso ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "14px" }}>✅</div>
              <h5 style={{ color: "var(--t1)", fontWeight: 800, marginBottom: "8px" }}>¡Pedido realizado!</h5>
              <p style={{ color: "var(--t2)", fontSize: "0.88rem" }}>
                Tu pedido fue registrado correctamente. Pronto recibirás tu colección.
              </p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="danger" className="alert-danger py-2 text-center mb-3" style={{ fontSize: "0.85rem" }}>
                  {error}
                </Alert>
              )}

              {/* Desglose de items */}
              <div style={{ marginBottom: "18px" }}>
                <p style={{ color: "var(--t3)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>
                  Resumen del pedido
                </p>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: "12px" }}>
                      <span style={{ color: "var(--t1)", fontSize: "0.84rem", fontWeight: 600, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.producto.nombre}
                      </span>
                      <span style={{ color: "var(--t3)", fontSize: "0.74rem" }}>
                        ${item.producto.precio.toLocaleString()} × {item.cantidad}
                      </span>
                    </div>
                    <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: "0.84rem", flexShrink: 0 }}>
                      ${(item.producto.precio * item.cantidad).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ background: "var(--bg-4)", borderRadius: "var(--r2)", padding: "14px 18px", marginBottom: "22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--t2)", fontSize: "0.84rem" }}>Total a pagar</span>
                <span className="text-gold" style={{ fontWeight: 800, fontSize: "1.3rem" }}>${total.toLocaleString()}</span>
              </div>
              <Form.Group className="mb-4">
                <Form.Label className="label-theme">Dirección de envío</Form.Label>
                <Form.Control
                  className="input-theme"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle 123, Ciudad, País"
                  required
                />
              </Form.Group>
              <Button type="submit" className="btn-theme-primary w-100" style={{ padding: "13px" }} disabled={cargando}>
                {cargando ? "Procesando…" : `Confirmar Pedido · $${total.toLocaleString()}`}
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Drawer del carrito ─── */
export default function CarritoDrawer({ open, onClose, usuario, onChange, onUsuarioActualizado, onProductosChange }) {
  const [carrito, setCarrito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (open && usuario) fetchCarrito();
  }, [open]);

  const fetchCarrito = async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/carrito/${usuario.id}`);
      setCarrito(await res.json());
    } finally {
      setCargando(false);
    }
  };

  const eliminarItem = async (itemId) => {
    await fetch(`${API_BASE}/carrito/${usuario.id}/item/${itemId}`, { method: "DELETE" });
    fetchCarrito();
    onChange();
  };

  const cambiarCantidad = async (item, delta) => {
    const nueva = item.cantidad + delta;
    if (nueva < 1) { eliminarItem(item.id); return; }
    await fetch(`${API_BASE}/carrito/${usuario.id}/item/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto_id: item.producto_id, cantidad: nueva }),
    });
    fetchCarrito();
    onChange();
  };

  const items = carrito?.items ?? [];
  const total = items.reduce((s, i) => s + i.producto.precio * i.cantidad, 0);

  return (
    <>
      {open && <div className="cart-backdrop open" onClick={onClose} />}

      <div className={`cart-drawer${open ? " open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h5 style={{ color: "var(--t1)", fontWeight: 800, margin: 0, fontSize: "1rem" }}>Mi Carrito</h5>
            {items.length > 0 && (
              <p style={{ color: "var(--t2)", fontSize: "0.78rem", margin: "3px 0 0" }}>
                {items.length} {items.length === 1 ? "producto" : "productos"}
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--t2)", fontSize: "1.2rem", cursor: "pointer", padding: "4px 8px", borderRadius: "6px", lineHeight: 1, transition: "color .15s" }}
            onMouseOver={(e) => (e.currentTarget.style.color = "var(--t1)")}
            onMouseOut={(e) => (e.currentTarget.style.color = "var(--t2)")}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px" }}>
          {cargando ? (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "50px" }}>
              <Spinner animation="grow" style={{ color: "var(--gold)" }} />
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: "70px" }}>
              <div style={{ fontSize: "2.8rem", marginBottom: "14px" }}>🧢</div>
              <p style={{ color: "var(--t1)", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 6px" }}>Tu carrito está vacío</p>
              <p style={{ color: "var(--t2)", fontSize: "0.83rem", margin: 0 }}>Agrega productos desde el catálogo.</p>
            </div>
          ) : (
            items.map((item) => {
              const img = imgPrincipal(item.producto);
              return (
                <div key={item.id} style={{ display: "flex", gap: "14px", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden", background: "var(--bg-1)", flexShrink: 0 }}>
                    {img
                      ? <img src={img} alt={item.producto.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--t3)", fontSize: "0.6rem" }}>IMG</div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "var(--t1)", fontWeight: 600, fontSize: "0.88rem", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.producto.nombre}
                    </p>
                    <p style={{ color: "var(--gold)", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 10px" }}>
                      ${(item.producto.precio * item.cantidad).toLocaleString()}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button className="qty-btn" onClick={() => cambiarCantidad(item, -1)}>−</button>
                      <span style={{ color: "var(--t1)", fontWeight: 700, fontSize: "0.88rem", minWidth: "22px", textAlign: "center" }}>{item.cantidad}</span>
                      <button className="qty-btn" onClick={() => cambiarCantidad(item, +1)}>+</button>
                      <button onClick={() => eliminarItem(item.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--err)", fontSize: "0.75rem", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "18px 22px", borderTop: "1px solid var(--border)", background: "var(--bg-1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "var(--t2)", fontSize: "0.84rem" }}>Total</span>
              <span className="text-gold" style={{ fontWeight: 800, fontSize: "1.35rem" }}>${total.toLocaleString()}</span>
            </div>
            <Button className="btn-theme-primary w-100" style={{ padding: "13px" }} onClick={() => setCheckoutOpen(true)}>
              Finalizar Pedido →
            </Button>
          </div>
        )}
      </div>

      {checkoutOpen && (
        <Checkout
          usuario={usuario}
          total={total}
          items={items}
          onUsuarioActualizado={onUsuarioActualizado}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            setCheckoutOpen(false);
            setCarrito(null);
            fetchCarrito();
            onChange();
            onProductosChange?.();
            onClose();
          }}
        />
      )}
    </>
  );
}