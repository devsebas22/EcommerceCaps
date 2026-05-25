import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export default function ProductModal({ producto, esAdmin, onClose, onAgregarAlCarrito }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selImgIdx, setSelImgIdx] = useState(0);
  const touchStartX = useRef(null);

  const imgs = producto?.imagenes ?? [];
  const multiImg = imgs.length > 1;

  useEffect(() => {
    if (!producto) return;
    const idx = imgs.findIndex((i) => i.es_principal);
    setSelImgIdx(idx >= 0 ? idx : 0);
  }, [producto?.id]);

  if (!producto) return null;

  const prev = () => setSelImgIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setSelImgIdx((i) => (i + 1) % imgs.length);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null || !multiImg) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const selImg = imgs.length > 0 ? imgs[selImgIdx]?.url : null;
  const slides = imgs.length > 0
    ? imgs.map((img) => ({ src: img.url }))
    : selImg ? [{ src: selImg }] : [];

  const navBtnStyle = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: "12px",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.88)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
    padding: 0,
    transition: "background .15s, transform .15s",
  });

  return (
    <>
      <Modal show={!!producto} onHide={onClose} centered size="lg" contentClassName="modal-product-c" className="modal-product">
        <Modal.Body>
          {/* Imagen principal con flechas y swipe */}
          {selImg && (
            <div
              style={{ height: "240px", overflow: "hidden", background: "var(--bg-1)", position: "relative", cursor: "zoom-in" }}
              onClick={() => setLightboxOpen(true)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <img
                src={selImg}
                alt={producto.nombre}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", userSelect: "none" }}
                draggable={false}
              />

              {multiImg && (
                <>
                  <button
                    style={navBtnStyle("left")}
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,1)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.88)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    style={navBtnStyle("right")}
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,1)"; e.currentTarget.style.transform = "translateY(-50%) scale(1.08)"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.88)"; e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight />
                  </button>

                  {/* Indicadores de posición */}
                  <div style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "5px",
                    pointerEvents: "none",
                  }}>
                    {imgs.map((_, idx) => (
                      <div key={idx} style={{
                        width: idx === selImgIdx ? "16px" : "6px",
                        height: "6px",
                        borderRadius: "3px",
                        background: idx === selImgIdx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                        transition: "width .2s, background .2s",
                      }} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Miniaturas */}
          {multiImg && (
            <div style={{
              display: "flex",
              gap: "8px",
              padding: "10px 14px",
              background: "var(--bg-1)",
              borderBottom: "1px solid var(--border)",
              overflowX: "auto",
            }}>
              {imgs.map((img, idx) => (
                <button
                  key={img.id ?? idx}
                  onClick={() => setSelImgIdx(idx)}
                  style={{
                    width: "60px",
                    height: "60px",
                    padding: 0,
                    border: idx === selImgIdx ? "2px solid #1D1D1F" : "2px solid transparent",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "var(--bg-1)",
                    flexShrink: 0,
                    transition: "border-color .15s",
                    outline: "none",
                  }}
                >
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: "28px 32px" }}>
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

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--t3)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
                Disponibilidad
              </span>
              {esAdmin ? (
                <span style={{ fontWeight: 600, fontSize: "0.88rem", color: producto.stock > 5 ? "#1A7F37" : producto.stock > 0 ? "#BF6900" : "#CC2D22" }}>
                  {producto.stock > 0 ? `${producto.stock} unidades` : "Sin stock"}
                </span>
              ) : (
                <span style={{ fontWeight: 600, fontSize: "0.88rem", color: producto.stock > 0 ? "#1A7F37" : "#CC2D22" }}>
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
            style={{ background: "none", border: "none", color: "var(--t2)", fontSize: "0.88rem", cursor: "pointer", padding: "13px 8px", fontFamily: "inherit" }}
          >
            Cerrar
          </button>
        </Modal.Footer>
      </Modal>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={selImgIdx}
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
