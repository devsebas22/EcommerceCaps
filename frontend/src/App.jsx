import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav } from "react-bootstrap";
import Catalogo from "./Catalogo";
import Registro from "./Registro";

export default function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">Ecommerce Caps</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Catálogo</Nav.Link>
              <Nav.Link as={Link} to="/registro">Crear Cuenta</Nav.Link>
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
