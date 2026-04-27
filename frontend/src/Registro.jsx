import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const API_BASE = "http://127.0.0.1:8000";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!email.trim()) e.email = "El email es obligatorio.";
    else {
      const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!re.test(email)) e.email = "Formato de email inválido.";
    }
    if (!password) e.password = "La contraseña es obligatoria.";
    else if (password.length < 6) e.password = "Mínimo 6 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setMessage(null);
    if (!validar()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Cuenta creada correctamente." });
        setNombre("");
        setEmail("");
        setPassword("");
        setErrors({});
      } else {
        const errBody = await res.json().catch(() => null);
        const text = errBody?.detail || errBody?.message || `Error ${res.status}`;
        setMessage({ type: "danger", text });
      }
    } catch (err) {
      setMessage({ type: "danger", text: err.message || "Error de red" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Crear Cuenta</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            isInvalid={!!errors.nombre}
          />
          <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Crear Cuenta"}
        </Button>
      </Form>
    </div>
  );
}
