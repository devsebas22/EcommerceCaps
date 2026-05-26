import React, { useState } from "react";

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const inputBase = {
  background: "#FFFFFF",
  border: "1px solid #D2D2D7",
  color: "#1D1D1F",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "0.88rem",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color .18s",
};

export default function FiltroProductos({
  busqueda, setBusqueda,
  categoriaFiltro, setCategoriaFiltro,
  precioMax, setPrecioMax,
  categorias,
  esAdmin,
  busquedaId, setBusquedaId,
}) {
  const [abiertos, setAbiertos] = useState(false);
  const hayFiltros = busqueda || categoriaFiltro || precioMax || busquedaId;

  return (
    <div>
      {/* Botón toggle — solo visible en mobile via CSS */}
      <button
        className="filtro-toggle-btn"
        onClick={() => setAbiertos(!abiertos)}
      >
        <span>Filtros{hayFiltros ? " (activos)" : ""}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {abiertos
            ? <polyline points="18 15 12 9 6 15"/>
            : <polyline points="6 9 12 15 18 9"/>}
        </svg>
      </button>

      {/* Contenido de filtros */}
      <div className={`filtros-body${abiertos ? " open" : ""}`}>

        {/* Búsqueda */}
        <div style={{ flex: "1", minWidth: "200px", position: "relative" }}>
          <span style={{
            position: "absolute", left: "12px", top: "50%",
            transform: "translateY(-50%)", color: "#AEAEB2",
            display: "flex", pointerEvents: "none",
          }}>
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ ...inputBase, width: "100%", paddingLeft: "38px" }}
            onFocus={e => e.currentTarget.style.borderColor = "#1D1D1F"}
            onBlur={e => e.currentTarget.style.borderColor = "#D2D2D7"}
          />
        </div>

        {/* Categoría */}
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{
            ...inputBase,
            color: categoriaFiltro ? "#1D1D1F" : "#AEAEB2",
            cursor: "pointer",
            minWidth: "160px",
          }}
          onFocus={e => e.currentTarget.style.borderColor = "#1D1D1F"}
          onBlur={e => e.currentTarget.style.borderColor = "#D2D2D7"}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        {/* Rango precio */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "var(--t2)", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
            Hasta ${precioMax ? Number(precioMax).toLocaleString() : "∞"}
          </span>
          <input
            type="range"
            min="0"
            max="2000000"
            step="10000"
            value={precioMax || 2000000}
            onChange={(e) => setPrecioMax(e.target.value === "2000000" ? "" : e.target.value)}
            className="slider-theme"
            style={{ width: "110px" }}
          />
        </div>

        {/* Buscar por ID (admin) */}
        {esAdmin && (
          <input
            type="number"
            placeholder="ID #"
            value={busquedaId}
            onChange={(e) => setBusquedaId(e.target.value)}
            style={{ ...inputBase, width: "80px" }}
            onFocus={e => e.currentTarget.style.borderColor = "#1D1D1F"}
            onBlur={e => e.currentTarget.style.borderColor = "#D2D2D7"}
          />
        )}

        {/* Limpiar filtros */}
        {hayFiltros && (
          <button
            onClick={() => {
              setBusqueda(""); setCategoriaFiltro(""); setPrecioMax("");
              if (setBusquedaId) setBusquedaId("");
            }}
            style={{
              background: "none",
              border: "1px solid var(--border-md)",
              color: "var(--t2)",
              borderRadius: "10px",
              padding: "10px 14px",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
