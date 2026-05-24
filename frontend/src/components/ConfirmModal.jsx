import React from "react";
import { Modal } from "react-bootstrap";

export default function ConfirmModal({ show, titulo, mensaje, onConfirmar, onCancelar, labelConfirmar = "Eliminar" }) {
  return (
    <Modal show={show} onHide={onCancelar} centered className="modal-admin" size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: 0, lineHeight: 1.6 }}>{mensaje}</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={onCancelar}
          style={{
            background: "none",
            border: "1px solid var(--border-md)",
            color: "var(--t2)",
            borderRadius: "8px",
            padding: "9px 20px",
            cursor: "pointer",
            fontSize: "0.84rem",
            fontFamily: "inherit",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          style={{
            background: "none",
            border: "none",
            color: "#CC2D22",
            borderRadius: "8px",
            padding: "9px 20px",
            cursor: "pointer",
            fontSize: "0.84rem",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          {labelConfirmar}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
