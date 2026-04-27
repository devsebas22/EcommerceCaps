import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import Catalogo from "./Catalogo";
import Registro from "./Registro";

export default function App() {
  return (
    <Router>
      <Navbar expand="lg" className="navbar-theme mb-5 sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-theme text-uppercase">
            Ecommerce Caps
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" className="border-0 bg-light" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="nav-link-theme px-3">Catálogo</Nav.Link>
              <Nav.Link as={Link} to="/registro" className="nav-link-theme px-3">Crear Cuenta</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </Container>
    </Router>
  );
}