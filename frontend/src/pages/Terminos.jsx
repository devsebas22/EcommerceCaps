import React from "react";
import { Link } from "react-router-dom";

export default function Terminos() {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px" }}>
      <Link to="/" style={{ fontSize: "0.82rem", color: "var(--t2)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "32px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Volver al catálogo
      </Link>

      <h1 style={{ fontWeight: 800, fontSize: "1.8rem", color: "var(--t1)", margin: "0 0 8px" }}>
        Términos y Condiciones
      </h1>
      <p style={{ color: "var(--t3)", fontSize: "0.78rem", margin: "0 0 40px" }}>
        Última actualización: {new Date().getFullYear()}
      </p>

      <div style={{ color: "var(--t2)", fontSize: "0.92rem", lineHeight: 1.8 }}>
        <p>
          Al realizar una compra en CapsCo aceptas los siguientes términos y condiciones.
          Estamos trabajando en la versión completa de este documento.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Productos y precios
        </h2>
        <p>
          Todos los precios están expresados en pesos colombianos (COP) e incluyen IVA.
          Las imágenes de los productos son ilustrativas. La disponibilidad está sujeta a stock.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Pagos
        </h2>
        <p>
          Los pagos se procesan a través de Wompi. CapsCo no almacena datos de tarjetas de crédito ni débito.
          Aceptamos Visa, Mastercard, PSE, Nequi y Bancolombia.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Envíos
        </h2>
        <p>
          Realizamos envíos a todo el territorio colombiano. El tiempo de entrega depende de la ciudad de destino
          y la transportadora seleccionada.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Devoluciones
        </h2>
        <p>
          Para solicitar una devolución, contáctanos dentro de los 5 días hábiles siguientes a la entrega.
          El producto debe estar en las mismas condiciones en que fue recibido.
        </p>

        <h2 style={{ color: "var(--t1)", fontWeight: 700, fontSize: "1.05rem", marginTop: "36px" }}>
          Contacto
        </h2>
        <p>
          Cualquier consulta sobre estos términos puede enviarse por WhatsApp al{" "}
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "573154895642"}?text=${encodeURIComponent("Hola, tengo una pregunta sobre los términos y condiciones de CapsCo")}`}
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
