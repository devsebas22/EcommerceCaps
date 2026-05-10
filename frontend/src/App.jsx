import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Catalogo from "./Catalogo";
import Registro from "./Registro";
import Login from "./Login";
import AdminLogin from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import CarritoDrawer from "./Carrito";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carritoOpen, setCarritoOpen] = useState(false);
  const [carritoCount, setCarritoCount] = useState(0);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  useEffect(() => {
    if (!usuario) { setCarritoCount(0); return; }
    fetchCarritoCount();
  }, [usuario]);

  const fetchCarritoCount = async () => {
    if (!usuario) return;
    try {
      const res = await fetch(`${API_BASE}/carrito/${usuario.id}`);
      const data = await res.json();
      setCarritoCount(data.items?.length ?? 0);
    } catch { /* silencioso */ }
  };

  const handleLogin = (data) => {
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setCarritoOpen(false);
  };

  return (
    <Router>
      <Routes>
        {/* Admin — layout propio */}
        <Route
          path="/admin"
          element={
            usuario?.es_admin
              ? <Dashboard admin={usuario} onLogout={handleLogout} />
              : <AdminLogin onLogin={handleLogin} />
          }
        />

        {/* Rutas públicas */}
        <Route
          path="*"
          element={
            <>
              <Navbar expand="lg" className="navbar-theme sticky-top">
                <Container>
                  <Navbar.Brand as={Link} to="/" className="navbar-brand-theme">
                    ECOMMERCE CAPS
                  </Navbar.Brand>
                  <Navbar.Toggle
                    aria-controls="main-navbar"
                    className="border-0"
                    style={{ filter: "invert(1) opacity(0.5)" }}
                  />
                  <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-center gap-3">
                      <Nav.Link as={Link} to="/" className="nav-link-theme">
                        Catálogo
                      </Nav.Link>

                      {usuario ? (
                        <>
                          {/* Carrito */}
                          <button
                            className="cart-btn"
                            onClick={() => setCarritoOpen(true)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                              <line x1="3" y1="6" x2="21" y2="6"/>
                              <path d="M16 10a4 4 0 01-8 0"/>
                            </svg>
                            Carrito
                            {carritoCount > 0 && (
                              <span className="cart-badge">{carritoCount}</span>
                            )}
                          </button>

                          <span style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
                            Hola,{" "}
                            <span className="text-gold fw-semibold">{usuario.nombre.split(" ")[0]}</span>
                          </span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={handleLogout}
                            style={{ borderRadius: "8px", fontSize: "0.8rem", padding: "6px 16px" }}
                          >
                            Salir
                          </Button>
                        </>
                      ) : (
                        <>
                          <Nav.Link as={Link} to="/login" className="nav-link-theme">
                            Iniciar Sesión
                          </Nav.Link>
                          <Link
                            to="/registro"
                            className="btn btn-theme-primary text-decoration-none"
                            style={{ padding: "8px 20px" }}
                          >
                            Crear Cuenta
                          </Link>
                        </>
                      )}
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>

              <Routes>
                <Route
                  path="/"
                  element={
                    <Container className="py-5">
                      <Catalogo usuario={usuario} onCarritoChange={fetchCarritoCount} />
                    </Container>
                  }
                />
                <Route path="/login"    element={<Login onLogin={handleLogin} />} />
                <Route path="/registro" element={<Registro />} />
              </Routes>

              {/* Carrito drawer — nivel raíz para el overlay correcto */}
              <CarritoDrawer
                open={carritoOpen}
                onClose={() => setCarritoOpen(false)}
                usuario={usuario}
                onChange={fetchCarritoCount}
              />
            </>
          }
        />
      </Routes>
    </Router>
  );
}
