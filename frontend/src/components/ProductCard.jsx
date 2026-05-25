import React, { useState } from "react";
import { Col } from "react-bootstrap";

export default function ProductCard({
  producto: p,
  esAdmin,
  agregadoId,
  agregando,
  onVer,
  onAgregarAlCarrito,
  onEditar,
  onEliminar,
}) {
  const imgs = p.imagenes ?? [];

  const [imgIdx, setImgIdx] = useState(() => {
    const idx = imgs.findIndex((i) => i.es_principal);
    return idx >= 0 ? idx : 0;
  });
  const [hovered, setHovered] = useState(false);

  const safeIdx = imgs.length > 0 ? imgIdx % imgs.length : 0;
  const currentImg = imgs.length > 0 ? imgs[safeIdx]?.url : null;
  const multiImg = imgs.length > 1;

  const yaAgregado = agregadoId === p.id;

  const prev = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i - 1 + imgs.length) % imgs.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i + 1) % imgs.length);
  };

  const arrowStyle = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: "8px",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.88)",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 2,
    boxShadow: "0 1px 6px rgba(0,0,0,.18)",
    padding: 0,
    opacity: hovered && multiImg ? 1 : 0,
    transition: "opacity .18s",
    pointerEvents: hovered && multiImg ? "auto" : "none",
  });

  return (
    <Col>
      <div className="h-100 card-product" style={{ display: "flex", flexDirection: "column" }}>
        {/* Imagen */}
        <div
          style={{
            height: "215px",
            background: "var(--bg-1)",
            overflow: "hidden",
            position: "relative",
            cursor: "pointer",
            flexShrink: 0,
          }}
          onClick={() => onVer(p)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {currentImg ? (
            <img
              src={currentImg}
              alt={p.nombre}
              className="prod-img"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s var(--ease)" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--t3)", fontSize: "0.72rem", letterSpacing: "1px" }}>
              SIN IMAGEN
            </div>
          )}

          {/* Flecha izquierda */}
          <button style={arrowStyle("left")} onClick={prev} aria-label="Imagen anterior">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Flecha derecha */}
          <button style={arrowStyle("right")} onClick={next} aria-label="Imagen siguiente">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* Indicadores de puntos */}
          {multiImg && (
            <div style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "4px",
              opacity: hovered ? 1 : 0.55,
              transition: "opacity .18s",
            }}>
              {imgs.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    width: idx === safeIdx ? "14px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: idx === safeIdx ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                    transition: "width .2s, background .2s",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cuerpo */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "18px 20px" }}>
          {esAdmin && (
            <span style={{ color: "var(--t3)", fontSize: "0.68rem", fontWeight: 600, marginBottom: "4px", display: "block" }}>
              #{p.id}
            </span>
          )}

          <span
            className="badge-cat"
            style={{ marginBottom: "8px", cursor: "pointer" }}
            onClick={() => onVer(p)}
          >
            {p.categoria?.nombre ?? "Colección"}
          </span>

          <p
            style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--t1)", margin: "0 0 3px", lineHeight: 1.3, cursor: "pointer" }}
            onClick={() => onVer(p)}
          >
            {p.nombre}
          </p>

          {p.marca && (
            <p style={{ fontSize: "0.78rem", color: "var(--t2)", margin: 0 }}>{p.marca}</p>
          )}

          <div style={{ marginTop: "auto", paddingTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "var(--t3)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Precio
              </span>
              <span style={{ color: "var(--t1)", fontWeight: 800, fontSize: "1.1rem" }}>
                ${p.precio.toLocaleString()}
              </span>
            </div>

            {esAdmin && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span style={{ color: "var(--t3)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Stock
                </span>
                <span style={{
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  color: p.stock > 5 ? "#1A7F37" : p.stock > 0 ? "#BF6900" : "#CC2D22",
                }}>
                  {p.stock} uds
                </span>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onVer(p)}
                style={{
                  flex: "0 0 auto",
                  background: "none",
                  border: "1px solid var(--border-md)",
                  color: "var(--t2)",
                  borderRadius: "var(--r2)",
                  padding: "9px 14px",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "border-color .15s, color .15s",
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--t3)"; e.currentTarget.style.color = "var(--t1)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.color = "var(--t2)"; }}
              >
                Ver
              </button>

              {esAdmin ? (
                <>
                  <button
                    onClick={() => onEditar(p)}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "1px solid var(--border-md)",
                      color: "var(--t1)",
                      borderRadius: "var(--r2)",
                      padding: "9px",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onEliminar(p.id)}
                    style={{
                      flex: "0 0 auto",
                      background: "none",
                      border: "none",
                      color: "#CC2D22",
                      borderRadius: "var(--r2)",
                      padding: "9px 10px",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background .15s",
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "#FFF2F1"}
                    onMouseOut={e => e.currentTarget.style.background = "none"}
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onAgregarAlCarrito(p)}
                  disabled={agregando || p.stock === 0}
                  style={{
                    flex: 1,
                    background: p.stock === 0 ? "var(--bg-1)" : "#1D1D1F",
                    border: p.stock === 0 ? "1px solid var(--border-md)" : "none",
                    color: p.stock === 0 ? "var(--t3)" : "#FFFFFF",
                    borderRadius: "var(--r2)",
                    padding: "9px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: p.stock === 0 ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "background .18s",
                    opacity: agregando ? 0.6 : 1,
                  }}
                  onMouseOver={e => { if (p.stock !== 0 && !agregando) e.currentTarget.style.background = "#E31837"; }}
                  onMouseOut={e => { if (p.stock !== 0) e.currentTarget.style.background = "#1D1D1F"; }}
                >
                  {p.stock === 0 ? "Agotado" : yaAgregado ? "Agregado" : "Agregar"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
}
