import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const imgPrincipal = (p) =>
  p.imagenes?.find((i) => i.es_principal)?.url ?? p.imagenes?.[0]?.url ?? null;

export default function ProductModal({ producto, esAdmin, onClose, onAgregarAlCarrito }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!producto) return null;

  const selImg = imgPrincipal(producto);
  const slides = producto.imagenes?.map((img) => ({ src: img.url })) ?? (selImg ? [{ src: selImg }] : []);

  return (
    <>
      <Modal show={!!producto} onHide={onClose} centered size="lg" contentClassName="modal-product-c" className="modal-product">
        <Modal.Body>
          {selImg && (
            <div
              style={{ height: "240px", overflow: "hidden", cursor: "zoom-in", background: "var(--bg-1)" }}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={selImg}
                alt={producto.nombre}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          )}

          <div style={{ padding: "28px 32px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
              <div>
                <span style={{ color: "var(--t2)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>
                  {producto.categoria?.nombre}
                </span>
                <h4 style={{ color: "var(--t1)", fontWeight: 800, margin: "6px 0 4px", fontSize: "1.25rem" }}>
                  {producto.nombre}
                </h4>
                {producto.marca && (
                  <p style={{ color: "var(--t2)", fontSize: "0.85rem", margin: 0 }}>{producto.marca}</p>
                )}
              </div>
              <span style={{ color: "var(--t1)", fontWeight: 800, fontSize: "2rem", lineHeight: 1, flexShrink: 0 }}>
                ${producto.precio.toLocaleString()}
              </span>
            </div>

            <hr style={{ borderColor: "var(--border)", margin: "0 0 20px" }} />

            {producto.descripcion && (
              <p style={{ color: "var(--t2)", fontSize: "0.9rem", lineHeight: 1.75, margin: "0 0 20px" }}>
                {producto.descripcion}
              </p>
            )}

            {/* Disponibilidad */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--t3)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Disponibilidad
              </span>
              {esAdmin ? (
                <span style={{
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  color: producto.stock > 5 ? "#1A7F37" : producto.stock > 0 ? "#BF6900" : "#CC2D22",
                }}>
                  {producto.stock > 0 ? `${producto.stock} unidades` : "Sin stock"}
                </span>
              ) : (
                <span style={{
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  color: producto.stock > 0 ? "#1A7F37" : "#CC2D22",
                }}>
                  {producto.stock > 0 ? "Disponible" : "Agotado"}
                </span>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ background: "#FFFFFF", borderTop: "1px solid var(--border)", padding: "16px 32px", gap: "12px" }}>
          {!esAdmin && (
            <button
              onClick={() => { onAgregarAlCarrito(producto); onClose(); }}
              disabled={producto.stock === 0}
              style={{
                flex: 1,
                background: producto.stock === 0 ? "var(--bg-1)" : "#1D1D1F",
                border: "none",
                color: producto.stock === 0 ? "var(--t3)" : "#FFFFFF",
                borderRadius: "var(--r2)",
                padding: "13px",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: producto.stock === 0 ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--t2)",
              fontSize: "0.88rem",
              cursor: "pointer",
              padding: "13px 8px",
              fontFamily: "inherit",
            }}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      />

      <style>{`
        .modal-product-c {
          background: #FFFFFF !important;
          border: 1px solid #E8E8ED !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          box-shadow: 0 12px 48px rgba(0,0,0,.10) !important;
        }
        .modal-product .modal-body  { padding: 0 !important; background: #FFFFFF !important; }
        .modal-product .modal-footer { background: #FFFFFF !important; border-top: 1px solid #E8E8ED !important; }
      `}</style>
    </>
  );
}
