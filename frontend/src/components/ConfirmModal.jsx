import React from "react";
import { Modal } from "react-bootstrap";

export default function ConfirmModal({ show, titulo, mensaje, onConfirmar, onCancelar, labelConfirmar = "Eliminar" }) {
  return (
    <Modal show={show} onHide={onCancelar} centered className="modal-admin" size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ color: "var(--t2)", fontSize: "0.88rem", margin: 0 }}>{mensaje}</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          onClick={onCancelar}
          style={{
            background: "none",
            border: "1px solid var(--border-md)",
            color: "var(--t2)",
            borderRadius: "8px",
            padding: "8px 18px",
            cursor: "pointer",
            fontSize: "0.82rem",
            fontFamily: "inherit",
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          style={{
            background: "rgba(248,113,113,.10)",
            border: "1px solid rgba(248,113,113,.40)",
            color: "var(--err)",
            borderRadius: "8px",
            padding: "8px 20px",
            cursor: "pointer",
            fontSize: "0.82rem",
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
