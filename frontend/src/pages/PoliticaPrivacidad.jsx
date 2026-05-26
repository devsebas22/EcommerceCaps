import React from "react";
import { Link } from "react-router-dom";

export default function PoliticaPrivacidad() {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px" }}>
      <Link to="/" style={{ fontSize: "0.82rem", color: "var(--t2)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "32px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver al catálogo
      </Link>

      <h1 style={{ fontWeight: 800, fontSize: "1.8rem", color: "var(--t1)", margin: "0 0 8px" }}>
        Política de Privacidad
      </h1>
      <p style={{ color: "var(--t3)", fontSize: "0.78rem", margin: "0 0 40px" }}>
        Última actualización: {new Date().getFullYear()}
      </p>

      <div style={{ color: "var(--t2)", fontSize: "0.92rem", lineHeight: 1.8 }}>
        <p>
          Estamos trabajando en nuestra política de privacidad completa.
          Para cualquier pregunta sobre el tratamiento de tus datos personales, contáctanos directamente.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Datos que recopilamos
        </h2>
        <p>
          Recopilamos únicamente los datos necesarios para procesar tus pedidos: nombre, correo electrónico y dirección de entrega.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Uso de tus datos
        </h2>
        <p>
          Tus datos se utilizan exclusivamente para gestionar tus pedidos y enviarte notificaciones relacionadas con tu compra.
          No compartimos tu información con terceros salvo que sea estrictamente necesario para completar el servicio.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Contáctanos
        </h2>
        <p>
          Para más información sobre nuestra política de privacidad, escríbenos por WhatsApp al{" "}
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "573154895642"}?text=${encodeURIComponent("Hola, tengo una pregunta sobre la política de privacidad de CapsCo")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--t1)", fontWeight: 600 }}
          >
            +57 315 489 5642
          </a>
          .
        </p>
      </div>
    </div>
  );
}
