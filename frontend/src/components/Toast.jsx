import React from "react";

export default function Toast({ mensaje }) {
  if (!mensaje) return null;

  const isOk = mensaje.tipo === "ok";

  return (
    <div style={{
      position: "fixed", bottom: "24px", right: "24px",
      background: "#FFFFFF",
      border: `1px solid ${isOk ? "#30D158" : "#FF3B30"}`,
      borderLeft: `4px solid ${isOk ? "#30D158" : "#FF3B30"}`,
      color: isOk ? "#1A7F37" : "#CC2D22",
      borderRadius: "10px",
      padding: "14px 20px",
      fontWeight: 600,
      fontSize: "0.88rem",
      zIndex: 9999,
      boxShadow: "0 4px 20px rgba(0,0,0,.09)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      maxWidth: "320px",
    }}>
      {isOk ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )}
      {mensaje.texto}
    </div>
  );
}
