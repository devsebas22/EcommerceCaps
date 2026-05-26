import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "573154895642";

const MESSAGES = {
  "/mis-pedidos": "Hola, acabo de realizar un pedido en CapsCo y quiero hacer seguimiento",
  "/perfil":      "Hola, tengo una pregunta sobre mi cuenta en CapsCo",
};
const DEFAULT_MSG = "Hola, estoy interesado en un producto de CapsCo";

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState(false);

  const msg = MESSAGES[pathname] ?? DEFAULT_MSG;
  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,211,102,0.35), 0 2px 6px rgba(0,0,0,0.15)",
        textDecoration: "none",
        transform: hovered ? "scale(1.10)" : "scale(1)",
        transition: "transform .2s cubic-bezier(.4,0,.2,1), box-shadow .2s",
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg width="28" height="28" viewBox="0 0 32 32" fill="white">
        <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.347.632 4.647 1.831 6.667L2.667 29.333l6.84-1.795A13.29 13.29 0 0 0 16.003 29.333C23.369 29.333 29.333 23.364 29.333 16S23.369 2.667 16.003 2.667zm0 2.4c6.033 0 10.93 4.898 10.93 10.933S22.036 26.933 16.003 26.933a10.9 10.9 0 0 1-5.569-1.527l-.397-.24-4.063 1.066 1.085-3.956-.262-.408A10.9 10.9 0 0 1 5.07 16c0-6.035 4.898-10.933 10.933-10.933zm-3.29 5.2c-.205 0-.538.077-.82.385-.281.308-1.075 1.05-1.075 2.561s1.1 2.973 1.254 3.178c.153.205 2.152 3.286 5.232 4.478.731.285 1.3.456 1.745.583.733.21 1.4.18 1.927.11.587-.079 1.808-.739 2.064-1.453.257-.714.257-1.327.18-1.453-.077-.128-.282-.205-.59-.36-.308-.154-1.82-.897-2.102-1-.282-.103-.487-.154-.692.154-.205.308-.795.999-.974 1.204-.18.205-.359.23-.667.077-.308-.154-1.3-.48-2.476-1.528-.915-.815-1.534-1.823-1.713-2.13-.18-.309-.019-.475.134-.629.138-.138.308-.36.461-.538.154-.18.205-.309.308-.513.103-.205.051-.385-.026-.539-.077-.154-.692-1.667-.948-2.282-.25-.6-.503-.518-.692-.527l-.59-.011z"/>
      </svg>

      {/* Tooltip */}
      {hovered && (
        <span style={{
          position: "absolute",
          right: "68px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(29,29,31,0.88)",
          color: "#FFFFFF",
          fontSize: "0.75rem",
          fontWeight: 500,
          padding: "6px 10px",
          borderRadius: "8px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
          ¿Necesitas ayuda?
        </span>
      )}
    </a>
  );
}
