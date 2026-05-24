import React from "react";
import { Col } from "react-bootstrap";

const imgPrincipal = (p) =>
  p.imagenes?.find((i) => i.es_principal)?.url ?? p.imagenes?.[0]?.url ?? null;

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
  const img = imgPrincipal(p);
  const yaAgregado = agregadoId === p.id;

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
        >
          {img ? (
            <img
              src={img}
              alt={p.nombre}
              className="prod-img"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s var(--ease)" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--t3)", fontSize: "0.72rem", letterSpacing: "1px" }}>
              SIN IMAGEN
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

          {/* Categoría — texto gris pequeño, sin badge */}
          <span
            className="badge-cat"
            style={{ marginBottom: "8px", cursor: "pointer" }}
            onClick={() => onVer(p)}
          >
            {p.categoria?.nombre ?? "Colección"}
          </span>

          {/* Nombre */}
          <p
            style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--t1)", margin: "0 0 3px", lineHeight: 1.3, cursor: "pointer" }}
            onClick={() => onVer(p)}
          >
            {p.nombre}
          </p>

          {/* Marca */}
          {p.marca && (
            <p style={{ fontSize: "0.78rem", color: "var(--t2)", margin: 0 }}>{p.marca}</p>
          )}

          {/* Pie de la card */}
          <div style={{ marginTop: "auto", paddingTop: "16px" }}>
            {/* Precio */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "var(--t3)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Precio
              </span>
              <span style={{ color: "var(--t1)", fontWeight: 800, fontSize: "1.1rem" }}>
                ${p.precio.toLocaleString()}
              </span>
            </div>

            {/* Stock (solo admin) */}
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

            {/* Acciones */}
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
