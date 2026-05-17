import React from "react";

export default function FiltroProductos({ busqueda, setBusqueda, categoriaFiltro, setCategoriaFiltro, precioMax, setPrecioMax, categorias }) {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px", alignItems: "center" }}>
      
      {/* Buscador */}
      <div style={{ flex: "1", minWidth: "200px", position: "relative" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--t3)", fontSize: "0.85rem" }}>🔍</span>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "100%",
            background: "var(--bg-1)",
            border: "1px solid var(--border-md)",
            color: "var(--t1)",
            borderRadius: "var(--r2)",
            padding: "10px 14px 10px 36px",
            fontSize: "0.88rem",
            outline: "none",
            fontFamily: "inherit"
          }}
        />
      </div>

      {/* Filtro categoría */}
      <select
        value={categoriaFiltro}
        onChange={(e) => setCategoriaFiltro(e.target.value)}
        style={{
          background: "var(--bg-1)",
          border: "1px solid var(--border-md)",
          color: categoriaFiltro ? "var(--t1)" : "var(--t3)",
          borderRadius: "var(--r2)",
          padding: "10px 14px",
          fontSize: "0.88rem",
          cursor: "pointer",
          fontFamily: "inherit",
          minWidth: "150px"
        }}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      {/* Filtro precio */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "var(--t2)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
          Hasta ${precioMax ? Number(precioMax).toLocaleString() : "∞"}
        </span>
        <input
          type="range"
          min="0"
          max="2000000"
          step="10000"
          value={precioMax || 2000000}
          onChange={(e) => setPrecioMax(e.target.value === "2000000" ? "" : e.target.value)}
          style={{ width: "120px", accentColor: "var(--gold)", cursor: "pointer" }}
        />
      </div>

      {/* Limpiar filtros */}
      {(busqueda || categoriaFiltro || precioMax) && (
        <button
          onClick={() => { setBusqueda(""); setCategoriaFiltro(""); setPrecioMax(""); }}
          style={{
            background: "none",
            border: "1px solid var(--border-md)",
            color: "var(--t2)",
            borderRadius: "var(--r2)",
            padding: "10px 14px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all .2s"
          }}
        >
          ✕ Limpiar
        </button>
      )}
    </div>
  );
}