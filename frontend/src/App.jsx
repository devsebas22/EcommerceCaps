import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import Catalogo from "./pages/Catalogo";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import MisPedidos from "./pages/MisPedidos";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./admin/Dashboard";
import CarritoDrawer from "./Carrito";
import { useCarritoCount } from "./hooks/useCarrito";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);
  const [carritoOpen, setCarritoOpen] = useState(false);
  const [productosKey, setProductosKey] = useState(0);
  const { carritoCount, fetchCarritoCount } = useCarritoCount(usuario);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  const handleLogin = (data) => {
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setCarritoOpen(false);
    navigate("/");
  };

  const handleUsuarioActualizado = (data) => {
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  };

  return (
    <Routes>
      {/* Admin — layout propio */}
      <Route
        path="/admin"
        element={
          usuario?.es_admin
            ? <Dashboard admin={usuario} onLogout={handleLogout} />
            : <Login onLogin={handleLogin} />
        }
      />

      {/* Rutas públicas */}
      <Route
        path="*"
        element={
          <>
            <Navbar expand="lg" className="navbar-theme sticky-top">
              <Container>
                <Navbar.Brand className="navbar-brand-theme">
                  CAPSCO
                </Navbar.Brand>
                {/* Carrito visible en mobile (antes del toggle) */}
                {usuario && (
                  <button
                    className="cart-btn-mobile"
                    onClick={() => setCarritoOpen(true)}
                    style={{
                      position: "relative",
                      background: "transparent",
                      border: "none",
                      padding: "6px 8px",
                      cursor: "pointer",
                      color: "var(--t1)",
                    }}
                    aria-label="Carrito"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                    {carritoCount > 0 && (
                      <span className="cart-badge" style={{ position: "absolute", top: "2px", right: "2px" }}>{carritoCount}</span>
                    )}
                  </button>
                )}
                <Navbar.Toggle
                  aria-controls="main-navbar"
                  className="border-0"
                />
                <Navbar.Collapse id="main-navbar">
                  <Nav className="ms-auto align-items-center gap-3">
                    <Nav.Link as={Link} to="/" className={`nav-link-theme${location.pathname === "/" ? " active" : ""}`}>
                      Catálogo
                    </Nav.Link>

                    {usuario ? (
                      <>
                        <Nav.Link as={Link} to="/mis-pedidos" className={`nav-link-theme${location.pathname === "/mis-pedidos" ? " active" : ""}`}>
                          Mis Pedidos
                        </Nav.Link>

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

                        <Nav.Link as={Link} to="/perfil" className="nav-link-theme" style={{ padding: 0 }}>
                          <span style={{ color: "var(--t2)", fontSize: "0.85rem" }}>
                            Hola,{" "}
                            <span style={{ color: "var(--t1)", fontWeight: 600 }}>{usuario.nombre.split(" ")[0]}</span>
                          </span>
                        </Nav.Link>
                        <button
                          onClick={handleLogout}
                          style={{
                            background: "none",
                            border: "1px solid var(--border-md)",
                            color: "var(--t2)",
                            borderRadius: "8px",
                            fontSize: "0.82rem",
                            padding: "6px 16px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Salir
                        </button>
                      </>
                    ) : (
                      <>
                        <Nav.Link as={Link} to="/login" className={`nav-link-theme${location.pathname === "/login" ? " active" : ""}`}>
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
                    <Catalogo usuario={usuario} onCarritoChange={fetchCarritoCount} reloadTrigger={productosKey} />
                  </Container>
                }
              />
              <Route path="/login"           element={<Login onLogin={handleLogin} />} />
              <Route path="/registro"        element={<Registro />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password"  element={<ResetPassword />} />
              <Route path="/perfil"   element={<Perfil usuario={usuario} onLogout={handleLogout} onUsuarioActualizado={handleUsuarioActualizado} />} />
              <Route path="/mis-pedidos" element={<MisPedidos usuario={usuario} />} />
            </Routes>

            {/* Carrito drawer — nivel raíz para el overlay correcto */}
            <CarritoDrawer
              open={carritoOpen}
              onClose={() => setCarritoOpen(false)}
              usuario={usuario}
              onChange={fetchCarritoCount}
              onUsuarioActualizado={handleUsuarioActualizado}
              onProductosChange={() => setProductosKey((k) => k + 1)}
            />

            <footer style={{
              borderTop: "1px solid var(--border)",
              background: "#FFFFFF",
              padding: "28px 0",
              marginTop: "auto",
            }}>
              <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.78rem", letterSpacing: "2px", color: "var(--t1)" }}>CAPSCO</span>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--t2)", textAlign: "center" }}>
                  Los precios incluyen IVA. Las imágenes son ilustrativas. Disponibilidad sujeta a stock.
                </p>
                <div style={{ display: "flex", gap: "20px", fontSize: "0.73rem" }}>
                  <a href="/privacidad" style={{ color: "var(--t2)", textDecoration: "none" }}
                    onMouseOver={e => e.currentTarget.style.color = "var(--t1)"}
                    onMouseOut={e => e.currentTarget.style.color = "var(--t2)"}>
                    Política de Privacidad
                  </a>
                  <a href="/terminos" style={{ color: "var(--t2)", textDecoration: "none" }}
                    onMouseOver={e => e.currentTarget.style.color = "var(--t1)"}
                    onMouseOut={e => e.currentTarget.style.color = "var(--t2)"}>
                    Términos y Condiciones
                  </a>
                </div>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--t3)" }}>
                  © {new Date().getFullYear()} CapsCo. Todos los derechos reservados.
                </p>
              </div>
            </footer>
          </>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
